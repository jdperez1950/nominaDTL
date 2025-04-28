package Nomina.entity.controllers;

import org.springframework.http.HttpStatus;
import Nomina.entity.services.PeriodicidadPagoService;
import java.util.List;
import Nomina.entity.dto.PeriodicidadPagoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.entities.PeriodicidadPago;

/**
 * Controlador REST para la gestión de entidades PeriodicidadPago.
 * Proporciona endpoints para realizar operaciones CRUD sobre PeriodicidadPago.
 *
 * @RestController Marca esta clase como un controlador REST
 * @RequestMapping Define la ruta base para todos los endpoints
 */
@RestController
@RequestMapping("/api/periodicidadpagos")
public class PeriodicidadPagoController {

    /**
     * Servicio que gestiona la lógica de negocio para PeriodicidadPago.
     */
    private final PeriodicidadPagoService service;

    /**
     * Constructor que inyecta el servicio necesario para la gestión de PeriodicidadPago.
     *
     * @param service Servicio que implementa la lógica de negocio
     */
    @Autowired
    public PeriodicidadPagoController(PeriodicidadPagoService service) {
        this.service = service;
    }

    /**
     * Obtiene todas las entidades PeriodicidadPago disponibles.
     *
     * @return ResponseEntity con la lista de entidades si existen,
     *         o una lista vacía si no hay registros
     */
    @GetMapping
    public ResponseEntity<List<PeriodicidadPago>> findAll() {
        List<PeriodicidadPago> entities = service.findAll();
        return ResponseEntity.ok(entities);
    }

    /**
     * Busca una entidad PeriodicidadPago por su identificador.
     *
     * @param id Identificador único de la entidad
     * @return ResponseEntity con la entidad si existe,
     *         o ResponseEntity.notFound si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<PeriodicidadPago> findById(@PathVariable Long id) {
        Optional<PeriodicidadPago> entity = service.findById(id);
        return entity.map(ResponseEntity::ok).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Crea una nueva entidad PeriodicidadPago.
     *
     * @param dto DTO con los datos de la entidad a crear
     * @return ResponseEntity con la entidad creada y estado HTTP 201 (Created)
     */
    @PostMapping
    public ResponseEntity<PeriodicidadPago> save(@RequestBody PeriodicidadPagoDTO dto) {
        PeriodicidadPago savedEntity = service.save(dto);
        return new ResponseEntity<>(savedEntity, HttpStatus.CREATED);
    }

    /**
     * Actualiza una entidad PeriodicidadPago existente.
     *
     * @param id Identificador de la entidad a actualizar
     * @param dto DTO con los nuevos datos de la entidad
     * @return ResponseEntity con la entidad actualizada,
     *         o ResponseEntity.notFound si la entidad no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<PeriodicidadPago> update(@PathVariable Long id, @RequestBody PeriodicidadPagoDTO dto) {
        if (service.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        PeriodicidadPago updatedEntity = service.update(id, dto);
        return ResponseEntity.ok(updatedEntity);
    }

    /**
     * Elimina una entidad PeriodicidadPago por su identificador.
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
