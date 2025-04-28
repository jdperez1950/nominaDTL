package Nomina.entity.controllers;

import java.net.MalformedURLException;
import java.nio.file.Files;

import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.services.InformeService;
import org.springframework.beans.factory.annotation.Autowired;
import Nomina.entity.entities.Informe;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import java.io.IOException;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Objects;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.dto.InformeDTO;
import java.nio.file.Path;
import org.springframework.util.StringUtils;

/**
 * Controlador REST para la gestión de entidades Informe.
 * Proporciona endpoints para realizar operaciones CRUD sobre Informe.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/informes")
public class InformeController {

    /**
     * Servicio que gestiona la lógica de negocio para Informe.
     */
    private final InformeService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de Informe.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public InformeController(InformeService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades Informe disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     *         o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<Informe>> findAll() {
        List<Informe> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad Informe por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     *         o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Informe> findById(@PathVariable Long id) {
        Optional<Informe> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad Informe.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<Informe> save(@RequestBody InformeDTO dto) {
        Informe savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad Informe existente.
     *
     * @param id Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     *         o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Informe> update(@PathVariable Long id, @RequestBody InformeDTO dto) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Informe updatedEntity = service.update(id, dto);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Elimina una entidad Informe por su identificador.
     *
     * @param id Identificador de la entidad a eliminar
     * @return ResponseEntity con estado HTTP 204 (No Content) si se eliminó correctamente,
     *         o ResponseEntity.notFound si la entidad no existe
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
        Optional<Informe> optionalEntity = service.findById(id);
        if (optionalEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Informe informe = optionalEntity.get();
        List<String> archivos = new ArrayList<>();

        if (informe.getInformePDF() != null) {
            String[] contratistaPaths = informe.getInformePDF().split(",");
            for (String path : contratistaPaths) {
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
