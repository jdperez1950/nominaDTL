package Nomina.entity.controllers;

import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Proyecto;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

import Nomina.entity.services.ContratoService;
import Nomina.entity.entities.Contrato;
import org.springframework.beans.factory.annotation.Autowired;

import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.dto.ContratoDTO;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controlador REST para la gestión de entidades Contrato.
 * Proporciona endpoints para realizar operaciones CRUD sobre Contrato.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/contratos")
public class ContratoController {

    /**
     * Servicio que gestiona la lógica de negocio para Contrato.
     */
    private final ContratoService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de Contrato.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public ContratoController(ContratoService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades Contrato disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     * o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<Contrato>> findAll() {
        List<Contrato> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad Contrato por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     * o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Contrato> findById(@PathVariable Long id) {
        Optional<Contrato> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad Contrato.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<Contrato> save(@RequestBody ContratoDTO dto) {
        Contrato savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad Contrato existente.
     *
     * @param id  Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     * o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Contrato> update(@PathVariable Long id, @RequestBody ContratoDTO dto) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Contrato updatedEntity = service.update(id, dto);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Elimina una entidad Contrato por su identificador.
     *
     * @param id Identificador de la entidad a eliminar
     * @return ResponseEntity con estado HTTP 204 (No Content) si se eliminó correctamente,
     * o ResponseEntity.notFound si la entidad no existe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/visibles")
    public ResponseEntity<List<Contrato>> obtenerContratosVisibles(@RequestParam Long usuarioId) {
        List<Contrato> contratos = service.obtenerContratosVisibles(usuarioId);
        return ResponseEntity.ok(contratos);
    }

    /**
     * Obtiene las cuentas de cobro asociadas a un contrato específico.
     *
     * @param contratoId Identificador del proyecto
     * @return ResponseEntity con la lista de personas asociadas al proyecto
     */
    @GetMapping("/{username}/{contratoId}/cuentascobro")
    public ResponseEntity<List<CuentaCobro>> obtenerCuentasCobroPorContrato(@PathVariable String username,@PathVariable Long contratoId) {
        List<CuentaCobro> cuentas = service.obtenerCuentasCobroPorContrato(username, contratoId);
        return ResponseEntity.ok(cuentas);
    }

    /**
     * Obtiene los contratos asociados a una persona específica.
     *
     * @param personaId Identificador de la persona
     * @return ResponseEntity con la lista de contratos asociados a la persona
     */
    @GetMapping("/persona/{personaId}")
    public ResponseEntity<List<Contrato>> obtenerContratosPorPersona(@PathVariable Long personaId) {
        List<Contrato> contratos = service.findByPersonaId(personaId);
        return ResponseEntity.ok(contratos);
    }

    /**
     * Endpoint para obtener de los contratos el numero de pagos y la cantidad de cuentas de cobro que tiene asociadas
     * @param id
     * @return
     */
    @GetMapping("/{id}/detalle")
    public ResponseEntity<Map<String, Object>> obtenerDetalleContrato(@PathVariable Long id) {
        Optional<Contrato> contratoOpt = service.findById(id);
        if (contratoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Contrato contrato = contratoOpt.get();
        List<CuentaCobro> cuentasDeCobro = contrato.getCuentaCobro(); // Asegúrate de que la relación está correctamente configurada para cargar las cuentas de cobro
        int numeroCuentasCobro = cuentasDeCobro != null ? cuentasDeCobro.size() : 0;
        Map<String, Object> response = new HashMap<>();
        response.put("contrato", contrato);
        response.put("numeroCuentasCobro", numeroCuentasCobro);
        response.put("numeroPagosPermitidos", contrato.getNumeroPagos());

        return ResponseEntity.ok(response);
    }

    /**
     * Sube uno o varios archivos al servidor local.
     *
     * @param files Lista de archivos a subir (MultipartFile)
     * @return ResponseEntity con la lista de rutas de archivo subidas,
     *         o un INTERNAL_SERVER_ERROR si ocurre un problema.
     */
    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> files) {
        // Lista donde guardaremos las rutas resultantes de cada archivo
        List<String> filePaths = new ArrayList<>();

        String uploadDir = "uploads"; // Carpeta local donde se suben los archivos
        Path uploadPath = Paths.get(uploadDir);

        try {
            // Crear carpeta si no existe
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Guardar cada archivo
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = StringUtils.cleanPath(
                            Objects.requireNonNull(file.getOriginalFilename())
                    );
                    int randomNumber = (int) (Math.random() * 90000) + 10000;
                    String newFilename = randomNumber + "_" + originalFilename;
                    Path destinationFilePath = uploadPath.resolve(newFilename);
                    Files.copy(file.getInputStream(), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);
                    // Agregamos la ruta donde quedó almacenado el archivo
                    filePaths.add(destinationFilePath.toString());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        // Retornamos las rutas de todos los archivos subidos
        return ResponseEntity.ok(filePaths);
    }

    @GetMapping("/{id}/files")
    public ResponseEntity<List<String>> listarArchivosPorId(@PathVariable Long id) {
        Optional<Contrato> optionalEntity = service.findById(id);
        if (optionalEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Contrato contrato = optionalEntity.get();
        List<String> archivos = new ArrayList<>();

        if (contrato.getContratoPdf() != null) {
            String[] paths = contrato.getContratoPdf().split(",");
            for (String path : paths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }

        if (contrato.getArchivosAdicionales() != null) {
            String[] paths = contrato.getArchivosAdicionales().split(",");
            for (String path : paths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }

        return ResponseEntity.ok(archivos);
    }

    /**
     * Extrae el nombre del archivo de una ruta completa
     * @param path Ruta completa del archivo
     * @return Nombre del archivo sin la ruta
     */
    private String extractFileName(String path) {
        int lastBackslash = path.lastIndexOf('\\');
        int lastSlash = path.lastIndexOf('/');
        int lastSeparator = Math.max(lastBackslash, lastSlash);
        if (lastSeparator == -1) {return path;}
        return path.substring(lastSeparator + 1);
    }

    // Endpoint para descargar un archivo
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("file") String fileName) throws MalformedURLException {
        Path filePath = Paths.get("uploads").resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

}
