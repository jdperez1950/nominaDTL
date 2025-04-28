package Nomina.entity.controllers;

import Nomina.entity.dto.TipoContratoDTO;
import org.springframework.http.HttpStatus;
import java.util.List;
import Nomina.entity.services.TipoContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.entities.TipoContrato;

/**
 * Controlador REST para la gestión de entidades TipoContrato.
 * Proporciona endpoints para realizar operaciones CRUD sobre TipoContrato.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/tipocontratos")
public class TipoContratoController {

    /**
     * Servicio que gestiona la lógica de negocio para TipoContrato.
     */
    private final TipoContratoService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de TipoContrato.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public TipoContratoController(TipoContratoService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades TipoContrato disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     *         o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<TipoContrato>> findAll() {
        List<TipoContrato> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad TipoContrato por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     *         o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<TipoContrato> findById(@PathVariable Long id) {
        Optional<TipoContrato> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad TipoContrato.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<TipoContrato> save(@RequestBody TipoContratoDTO dto) {
        TipoContrato savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad TipoContrato existente.
     *
     * @param id Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     *         o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<TipoContrato> update(@PathVariable Long id, @RequestBody TipoContratoDTO dto) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        TipoContrato updatedEntity = service.update(id, dto);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Elimina una entidad TipoContrato por su identificador.
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

}
