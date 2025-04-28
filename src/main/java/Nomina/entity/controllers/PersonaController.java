package Nomina.entity.controllers;

import Nomina.entity.entities.Contrato;
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
import java.util.ArrayList;
import java.util.List;
import Nomina.entity.entities.Persona;
import Nomina.entity.services.PersonaService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;
import java.util.Optional;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.dto.PersonaDTO;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controlador REST para la gestión de entidades Persona.
 * Proporciona endpoints para realizar operaciones CRUD sobre Persona.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    /**
     * Servicio que gestiona la lógica de negocio para Persona.
     */
    private final PersonaService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de Persona.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public PersonaController(PersonaService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades Persona disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     *         o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<Persona>> findAll() {
        List<Persona> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad Persona por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     *         o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Persona> findById(@PathVariable Long id) {
        Optional<Persona> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad Persona.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<Persona> save(@RequestBody PersonaDTO dto) {
        Persona savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad Persona existente.
     *
     * @param id Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     *         o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Persona> update(@PathVariable Long id, @RequestBody PersonaDTO dto) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Persona updatedEntity = service.update(id, dto);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Elimina una entidad Persona por su identificador.
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
        Optional<Persona> optionalEntity = service.findById(id);
        if (optionalEntity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Persona persona = optionalEntity.get();
        List<String> archivos = new ArrayList<>();

        if (persona.getDocumentosFormacionAcademica() != null) {
            String[] paths = persona.getDocumentosFormacionAcademica().split(",");
            for (String path : paths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }

        if (persona.getDocumentosLegales() != null) {
            String[] paths = persona.getDocumentosLegales().split(",");
            for (String path : paths) {
                String fileName = extractFileName(path.trim());
                archivos.add(fileName);
            }
        }

        if (persona.getCertificacionesLaborales() != null) {
            String[] paths = persona.getCertificacionesLaborales().split(",");
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
