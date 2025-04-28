package Nomina.entity.controllers;

import java.net.MalformedURLException;
import java.nio.file.Files;
import org.springframework.beans.factory.annotation.Autowired;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import java.io.IOException;
import Nomina.entity.dto.CuentaCobroDTO;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import java.util.List;
import Nomina.entity.services.CuentaCobroService;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import Nomina.entity.entities.CuentaCobro;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import java.nio.file.Path;
import org.springframework.util.StringUtils;

/**
 * Controlador REST para la gestión de entidades CuentaCobro.
 * Proporciona endpoints para realizar operaciones CRUD sobre CuentaCobro.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/cuentacobros")
public class CuentaCobroController {

    /**
     * Servicio que gestiona la lógica de negocio para CuentaCobro.
     */
    private final CuentaCobroService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de CuentaCobro.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public CuentaCobroController(CuentaCobroService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades CuentaCobro disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     * o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<CuentaCobro>> findAll() {
        List<CuentaCobro> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad CuentaCobro por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     * o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<CuentaCobro> findById(@PathVariable Long id) {
        Optional<CuentaCobro> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad CuentaCobro.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<CuentaCobro> save(@RequestBody CuentaCobroDTO dto) {
        CuentaCobro savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad CuentaCobro existente.
     *
     * @param id  Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     * o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CuentaCobroDTO dto) {
        try {
            // Verificar si la entidad existe
            if (service.findById(id).isEmpty()) {
                System.out.println("No se encontró la cuenta de cobro con ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró la cuenta de cobro con ID: " + id);
            }

            System.out.println("Llamando a service.update con ID: " + id);
            CuentaCobro updatedEntity = service.update(id, dto);
            System.out.println("Actualización completada. Entidad actualizada con ID: " + updatedEntity.getId());

            return ResponseEntity.ok(updatedEntity);
        } catch (Exception e) {
            System.err.println("Error al actualizar la cuenta de cobro: " + e.getMessage());
            e.printStackTrace();

            // Devolver un mensaje de error más descriptivo
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la cuenta de cobro: " + e.getMessage());
        }
    }

    /**
     * Elimina una entidad CuentaCobro por su identificador.
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

    /**
     * Sube uno o varios archivos al servidor local.
     *
     * @param files Lista de archivos a subir (MultipartFile)
     * @return ResponseEntity con la lista de rutas de archivo subidas,
     * o un INTERNAL_SERVER_ERROR si ocurre un problema.
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

            // Guardar cada archivo con un número aleatorio de 4 dígitos en su nombre
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String originalFilename = StringUtils.cleanPath(
                            Objects.requireNonNull(file.getOriginalFilename())
                    );
                    // Generar un número aleatorio de 5 dígitos
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
        Optional<CuentaCobro> optionalEntity = service.findById(id);
        if (optionalEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CuentaCobro cuentaCobro = optionalEntity.get();
        List<String> archivos = new ArrayList<>();

        if (cuentaCobro.getFirmaContratista() != null) {
            String[] contratistaPaths = cuentaCobro.getFirmaContratista().split(",");
            for (String path : contratistaPaths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }
        if (cuentaCobro.getFirmaGerente() != null) {
            String[] gerentePaths = cuentaCobro.getFirmaGerente().split(",");
            for (String path : gerentePaths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }
        if (cuentaCobro.getPlanillaSeguridadSocial() != null) {
            String[] gerentePaths = cuentaCobro.getPlanillaSeguridadSocial().split(",");
            for (String path : gerentePaths) {
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
