package Nomina.entity.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import Nomina.entity.dto.CuentaCobroDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Persona;
import Nomina.seguridad.persistence.entities.Usuario;
import Nomina.entity.repositories.ContratoRepository;
import Nomina.entity.repositories.CuentaCobroRepository;
import Nomina.seguridad.persistence.repository.UserRepository;
import Nomina.entity.services.CuentaCobroService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import Nomina.seguridad.Interceptor.SecurityContextPersonalizado;
import Nomina.seguridad.service.RoleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementación del servicio {@link CuentaCobroService} que proporciona
 * la lógica de negocio para gestionar entidades {@link CuentaCobro}.
 * <p>Esta implementación se encarga de la gestión completa del ciclo de vida de las entidades,
 * incluyendo operaciones CRUD y métodos de negocio específicos.</p>
 */
@Service
@Transactional
public class CuentaCobroServiceImpl implements CuentaCobroService {

    private static final Logger log = LoggerFactory.getLogger(CuentaCobroServiceImpl.class);

    @Autowired
    private HibernateFilterActivator filterActivator;
    /**
     * Repositorio para acceder a los datos de la entidad
     */
    private final CuentaCobroRepository repository;

    @Autowired
    private SecurityContextPersonalizado securityContextPersonalizado;
    
    @Autowired
    private NotificacionEmailServiceImpl notificacionEmailService;
    
    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleService roleService;

    /**
     * Constructor que inicializa el servicio con su repositorio correspondiente.
     *
     * @param repository Repositorio para la entidad CuentaCobro
     */
    @Autowired
    public CuentaCobroServiceImpl(CuentaCobroRepository repository) {
        this.repository = repository;
    }

    /**
     * {@inheritDoc}
     */

    public List<CuentaCobro> findAll() {
        String usuarioActual = securityContextPersonalizado.getUsuarioActual();
        boolean esContador = securityContextPersonalizado.isEsContador();

        // Verificar si el usuario tiene rol ADMINISTRADOR o GERENTE
        List<String> rolesUsuario = securityContextPersonalizado.getRoles();
        boolean esAdminGerente = rolesUsuario.contains("ADMINISTRADOR") || rolesUsuario.contains("GERENTE");

        // Si es ADMINISTRADOR o GERENTE, devolver todas las cuentas
        if (esAdminGerente) {
            filterActivator.activarFiltro(Persona.class);
            return repository.findAll();
        }

        //Si no es ADMIN/GERENTE, aplicar filtros
        return repository.findByUsuario(usuarioActual, esContador, esAdminGerente);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<CuentaCobro> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public CuentaCobro save(CuentaCobroDTO dto) {
        CuentaCobro entity = new CuentaCobro();
        for (java.lang.reflect.Field field : dto.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                java.lang.reflect.Field entityField = entity.getClass().getDeclaredField(field.getName());
                entityField.setAccessible(true);
                entityField.set(entity, field.get(dto));
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        
        // Guardar la entidad
        CuentaCobro cuentaCobroGuardada = repository.save(entity);
        
        // Enviar notificación al gerente
        enviarNotificacionCreacionCuentaCobro(cuentaCobroGuardada);
        
        return cuentaCobroGuardada;
    }

    /**
     * Actualiza una entidad CuentaCobro existente.
     *
     * @param id  Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return La entidad actualizada
     * @throws RuntimeException Si la entidad no existe o hay un error durante la actualización
     */
    @Override
    @Transactional
    public CuentaCobro update(long id, CuentaCobroDTO dto) {
        try {
            // Buscar la entidad existente
            CuentaCobro cuentaCobro = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("No se encontró la entidad CuentaCobro con ID: " + id));

            // Verificar el estado actual del pago para saber si necesitaremos enviar notificación
            boolean pagoPrevio = cuentaCobro.isPago();
            System.out.println("Estado de pago previo: " + pagoPrevio);
            System.out.println("Estado de pago nuevo: " + dto.isPago());

            // Guardar el estado anterior
            boolean estadoAnterior = cuentaCobro.isEstado();

            // Guardar las relaciones actuales
            Contrato contratoActual = cuentaCobro.getContrato();
            Informe informeActual = cuentaCobro.getInforme();

            // Actualizar los campos simples
            cuentaCobro.setMontoCobrar(dto.getMontoCobrar());
            cuentaCobro.setFecha(dto.getFecha());
            cuentaCobro.setEstado(dto.isEstado());
            cuentaCobro.setNumeroCuenta(dto.getNumeroCuenta());
            cuentaCobro.setDetalle(dto.getDetalle());
            cuentaCobro.setPago(dto.isPago());
            cuentaCobro.setFirmaGerente(dto.getFirmaGerente());
            cuentaCobro.setFirmaContratista(dto.getFirmaContratista());
            cuentaCobro.setPeriodoACobrar(dto.getPeriodoACobrar());
            cuentaCobro.setObservaciones(dto.getObservaciones());

            // Verificar si el estado cambió a aprobado
            if (!estadoAnterior && cuentaCobro.isEstado()) {
                cuentaCobro.setFechaAprobacion(LocalDateTime.now());
                // Enviar notificación al contador cuando se aprueba la cuenta de cobro
                enviarNotificacionAprobacionCuentaCobro(cuentaCobro);
            }

            // Manejar el contrato - Si el DTO tiene un contrato, lo usamos; de lo contrario, mantenemos el actual
            if (dto.getContrato() != null && dto.getContrato().getId() > 0) {
                Contrato contrato = contratoRepository.findById(dto.getContrato().getId())
                        .orElse(contratoActual);
                cuentaCobro.setContrato(contrato);
            } else {
                cuentaCobro.setContrato(contratoActual);
            }

            // Guardar la entidad actualizada
            CuentaCobro cuentaCobroActualizada = repository.save(cuentaCobro);
            System.out.println("CuentaCobro guardada con ID: " + cuentaCobroActualizada.getId());

            // Verificar si necesitamos enviar notificación (pago cambió de false a true)
            if (!pagoPrevio && cuentaCobroActualizada.isPago()) {
                System.out.println("El estado de pago cambió de false a true, enviando notificación...");
                try {
                    enviarNotificacionPagoRealizado(cuentaCobroActualizada);
                } catch (Exception e) {
                    System.err.println("Error al enviar la notificación: " + e.getMessage());
                }
            }
            return cuentaCobroActualizada;
        } catch (Exception e) {
            System.err.println("Error al actualizar la entidad CuentaCobro: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar la entidad CuentaCobro: " + e.getMessage(), e);
        }
    }
    /**
     * Envía una notificación por correo electrónico cuando el pago de una cuenta de cobro se ha realizado.
     *
     * @param cuentaCobro La cuenta de cobro cuyo pago se ha realizado
     */
    private void enviarNotificacionPagoRealizado(CuentaCobro cuentaCobro) {
        try {
            // Validar que la cuenta de cobro tenga un contrato asociado
            Contrato contrato = cuentaCobro.getContrato();
            if (contrato == null) {
                System.err.println("Error: La cuenta de cobro ID " + cuentaCobro.getId() + " no tiene contrato asociado");
                return;
            }
            // Validar que el contrato tenga una persona asociada
            Persona persona = contrato.getPersona();
            if (persona == null) {
                System.err.println("Error: El contrato ID " + contrato.getId() + " no tiene persona asociada");
                return;
            }
            // Validar que la persona tenga un email
            String email = persona.getCorreo();
            if (email == null || email.isEmpty()) {
                System.err.println("Error: La persona ID " + persona.getId() + " no tiene email definido");
                return;
            }

            // Crear el objeto JSON para la notificación
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode rootNode = objectMapper.createObjectNode();

            // Agregar información de la cuenta de cobro
            rootNode.put("ID Cuenta Cobro", String.valueOf(cuentaCobro.getId()));
            rootNode.put("Fecha", cuentaCobro.getFecha() != null ?
                    cuentaCobro.getFecha().toString() : "No disponible");
            rootNode.put("Valor", String.valueOf(cuentaCobro.getMontoCobrar()));

            // Agregar información del contrato
            rootNode.put("Contrato ID", String.valueOf(contrato.getId()));
            rootNode.put("Tipo Contrato", contrato.getTipoContrato() != null ?
                    contrato.getTipoContrato().getNombreTipoContrato() : "No disponible");

            // Agregar información de la persona
            rootNode.put("Nombre", persona.getNombre());
            rootNode.put("Documento", persona.getNumeroDocumento());

            // Enviar el email de manera asíncrona
            CompletableFuture<String> future = notificacionEmailService.sendNotificationEmailAsync(
                    email,
                    "Notificación de Pago Realizado - Cuenta Cobro #" + cuentaCobro.getId(),
                    rootNode);

            // Registrar el resultado del envío
            future.thenAccept(result -> {
                System.out.println("Resultado del envío de email: " + result);
                // Actualizar la cuenta de cobro con la fecha de notificación en formato legible
                LocalDateTime now = LocalDateTime.now();
                String fechaFormateada = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                cuentaCobro.setNotificacionPago(fechaFormateada);
                repository.save(cuentaCobro);
            }).exceptionally(ex -> {
                System.err.println("Error al enviar notificación por email: " + ex.getMessage());
                return null;
            });
        } catch (Exception e) {
            System.err.println("Error grave al enviar notificación: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al enviar notificación de pago: " + e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteById(Long id) {
        Optional<CuentaCobro> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("CuentaCobro no encontrada con id: " + id);
        }

        CuentaCobro entity = optional.get();

        List<String> filePaths = new ArrayList<>();

        if (entity.getFirmaContratista() != null) {
            String[] contratistaPaths = entity.getFirmaContratista().split(",");
            for (String path : contratistaPaths) {
                path = path.trim();
                if (!path.isEmpty()) {
                    filePaths.add(path);
                }
            }
        }

        if (entity.getFirmaGerente() != null) {
            String[] gerentePaths = entity.getFirmaGerente().split(",");
            for (String path : gerentePaths) {
                path = path.trim();
                if (!path.isEmpty()) {
                    filePaths.add(path);
                }
            }
        }

        for (String filePathString : filePaths) {
            try {
                Path filePath = Path.of(filePathString).toAbsolutePath().normalize();
                Path uploadsDir = Path.of("uploads").toAbsolutePath().normalize();
                if (filePath.startsWith(uploadsDir)) {

                    Files.deleteIfExists(filePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        repository.deleteById(id);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    public List<CuentaCobro> findByContrato(Contrato contrato) {
        return repository.findByContrato(contrato);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<CuentaCobro> findByInforme(Informe informe) {
        return repository.findByInforme(informe);
    }

    /**
     * Envía una notificación por correo electrónico cuando se crea una nueva cuenta de cobro.
     *
     * @param cuentaCobro La cuenta de cobro recién creada
     */
    private void enviarNotificacionCreacionCuentaCobro(CuentaCobro cuentaCobro) {
        try {
            // Buscar usuarios con rol GERENTE
            List<Usuario> gerentes = userRepository.findAll().stream()
                    .filter(usuario -> usuario.getRoles().stream()
                            .anyMatch(rol -> "GERENTE".equals(rol.getNombre())))
                    .collect(Collectors.toList());

            if (gerentes.isEmpty()) {
                System.err.println("No se encontraron gerentes para enviar la notificación");
                return;
            }

            // Crear el objeto JSON para la notificación
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode rootNode = objectMapper.createObjectNode();

            // Agregar información de la cuenta de cobro
            rootNode.put("ID Cuenta Cobro", String.valueOf(cuentaCobro.getId()));
            rootNode.put("Creador de la cuenta de cobro", String.valueOf(cuentaCobro.getCreador()));
            rootNode.put("Fecha", cuentaCobro.getFecha() != null ?
                    cuentaCobro.getFecha().toString() : "No disponible");
            rootNode.put("Valor", String.valueOf(cuentaCobro.getMontoCobrar()));
            rootNode.put("Detalle", cuentaCobro.getDetalle());
            rootNode.put("Estado", cuentaCobro.isEstado() ? "Aprobada" : "Pendiente de aprobación");

            // Enviar notificación a cada gerente
            for (Usuario gerente : gerentes) {
                if (gerente.getCorreo() != null && !gerente.getCorreo().isEmpty()) {
                    CompletableFuture<String> future = notificacionEmailService.sendNotificationEmailAsync(
                            gerente.getCorreo(),
                            "Nueva Cuenta de Cobro Creada - #" + cuentaCobro.getId(),
                            rootNode);

                    future.thenAccept(result -> {
                    }).exceptionally(ex -> {
                        System.err.println("Error al enviar notificación a gerente: " + ex.getMessage());
                        return null;
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("Error al enviar notificación de creación: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Envía una notificación por correo electrónico cuando una cuenta de cobro es aprobada.
     *
     * @param cuentaCobro La cuenta de cobro aprobada
     */
    private void enviarNotificacionAprobacionCuentaCobro(CuentaCobro cuentaCobro) {
        try {
            // Buscar usuarios con rol CONTADOR
            List<Usuario> contadores = userRepository.findAll().stream()
                    .filter(usuario -> usuario.getRoles().stream()
                            .anyMatch(rol -> "CONTADOR".equals(rol.getNombre())))
                    .collect(Collectors.toList());

            if (contadores.isEmpty()) {
                System.err.println("No se encontraron contadores para enviar la notificación");
                return;
            }

            // Crear el objeto JSON para la notificación
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode rootNode = objectMapper.createObjectNode();

            // Agregar información de la cuenta de cobro
            rootNode.put("ID Cuenta Cobro", String.valueOf(cuentaCobro.getId()));
            rootNode.put("Creador de la cuenta de cobro", String.valueOf(cuentaCobro.getCreador()));
            rootNode.put("Fecha", cuentaCobro.getFecha() != null ?
                    cuentaCobro.getFecha().toString() : "No disponible");
            rootNode.put("Valor", String.valueOf(cuentaCobro.getMontoCobrar()));
            rootNode.put("Detalle", cuentaCobro.getDetalle());
            rootNode.put("Estado", "Aprobada");
            rootNode.put("Fecha Aprobación", cuentaCobro.getFechaAprobacion() != null ?
                    cuentaCobro.getFechaAprobacion().toString() : "No disponible");

            // Enviar notificación a cada contador
            for (Usuario contador : contadores) {
                if (contador.getCorreo() != null && !contador.getCorreo().isEmpty()) {
                    CompletableFuture<String> future = notificacionEmailService.sendNotificationEmailAsync(
                            contador.getCorreo(),
                            "Cuenta de Cobro Aprobada - #" + cuentaCobro.getId(),
                            rootNode);

                    future.thenAccept(result -> {
                    }).exceptionally(ex -> {
                        System.err.println("Error al enviar notificación a contador: " + ex.getMessage());
                        return null;
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("Error al enviar notificación de aprobación: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
