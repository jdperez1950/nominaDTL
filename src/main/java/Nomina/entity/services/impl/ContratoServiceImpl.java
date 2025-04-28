package Nomina.entity.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import Nomina.entity.dto.ContratoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.PeriodicidadPago;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.entities.TipoContrato;
import Nomina.entity.repositories.ContratoRepository;
import Nomina.entity.services.ContratoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del servicio {@link ContratoService} que proporciona
 * la lógica de negocio para gestionar entidades {@link Contrato}.
 * <p>Esta implementación se encarga de la gestión completa del ciclo de vida de las entidades,
 * incluyendo operaciones CRUD y métodos de negocio específicos.</p>
 */
@Service
@Transactional
public class ContratoServiceImpl implements ContratoService {

@Autowired
private HibernateFilterActivator filterActivator;     /** Repositorio para acceder a los datos de la entidad */
    private final ContratoRepository repository;

    /**
     * Constructor que inicializa el servicio con su repositorio correspondiente.
     * @param repository Repositorio para la entidad Contrato
     */
    @Autowired
    public ContratoServiceImpl(ContratoRepository repository) {
        this.repository = repository;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findAll() {
        filterActivator.activarFiltro(Contrato.class);
        return repository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<Contrato> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Contrato save(ContratoDTO dto) {
        Contrato entity = new Contrato();
        for (java.lang.reflect.Field field : dto.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                java.lang.reflect.Field entityField = entity.getClass().getDeclaredField(field.getName());
                entityField.setAccessible(true);
                Object value = field.get(dto);
                // Manejar el caso especial del proyecto con ID -1
                if (field.getName().equals("proyecto") && value != null) {
                    Proyecto proyecto = (Proyecto) value;
                    if (proyecto.getId() == -1) {
                        value = null;
                    }
                }
                entityField.set(entity, value);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return repository.save(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Contrato update(long id, ContratoDTO dto) {
        Optional<Contrato> optionalEntity = repository.findById(id);
        if (optionalEntity.isPresent()) {
            Contrato entity = optionalEntity.get();
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
            return repository.save(entity);
        } else {
            throw new RuntimeException("Entity not found");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteById(Long id) {
        Optional<Contrato> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Contrato no encontrado con id: " + id);
        }

        Contrato entity = optional.get();

        List<String> filePaths = new ArrayList<>();

        if (entity.getContratoPdf() != null) {
            String[] contratistaPaths = entity.getContratoPdf().split(",");
            for (String path : contratistaPaths) {
                path = path.trim();
                if (!path.isEmpty()) {
                    filePaths.add(path);
                }
            }
        }

        if (entity.getArchivosAdicionales() != null) {
            String[] contratistaPaths = entity.getArchivosAdicionales().split(",");
            for (String path : contratistaPaths) {
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
    public List<Contrato> findByProyecto(Proyecto proyecto) {
        return repository.findByProyecto(proyecto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByPersona(Persona persona) {
        return repository.findByPersona(persona);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByDocumento(Documento documento) {
        return repository.findByDocumento(documento);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByCuentaCobro(CuentaCobro cuentaCobro) {
        return repository.findByCuentaCobro(cuentaCobro);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByTipoContrato(TipoContrato tipoContrato) {
        return repository.findByTipoContrato(tipoContrato);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByPeriodicidadPago(PeriodicidadPago periodicidadPago) {
        return repository.findByPeriodicidadPago(periodicidadPago);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Contrato> findByInforme(Informe informe) {
        return repository.findByInforme(informe);
    }

    @Override
    public List<Contrato> obtenerContratosVisibles(Long usuarioId) {
        return repository.findByPersonaId(usuarioId);
    }

    @Override
    public List<CuentaCobro> obtenerCuentasCobroPorContrato(String username,Long contratoId) {

        try {
            // Buscar el contrato primero
            Optional<Contrato> contratoOptional = repository.findById(contratoId);

            if (contratoOptional.isPresent()) {
                Contrato contrato = contratoOptional.get();
                // Filtrar los contratos donde la persona está relacionada

                return contrato.getCuentaCobro().stream()
                        .filter(con -> con.getCreador().equals(username) )
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }


        // Devolver lista vacía si no se encuentra el contrato
        return new ArrayList<>();
    }

    @Override
    public List<Contrato> findByPersonaId(Long personaId) {
        return repository.findByPersonaId(personaId);
    }
}
