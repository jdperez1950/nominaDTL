package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.PeriodicidadPagoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.PeriodicidadPago;
import Nomina.entity.repositories.PeriodicidadPagoRepository;
import Nomina.entity.services.PeriodicidadPagoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link PeriodicidadPago}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades PeriodicidadPago.</p>
 */
public interface PeriodicidadPagoService {

    /**
     * Recupera todas las entidades PeriodicidadPago almacenadas.
     * @return Lista de todas las entidades PeriodicidadPago encontradas
     */
    List<PeriodicidadPago> findAll();

    /**
     * Busca una entidad PeriodicidadPago por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<PeriodicidadPago> findById(Long id);

    /**
     * Guarda una nueva entidad PeriodicidadPago en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad PeriodicidadPago creada y persistida
     */
    PeriodicidadPago save(PeriodicidadPagoDTO dto);

    /**
     * Actualiza una entidad PeriodicidadPago existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad PeriodicidadPago actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    PeriodicidadPago update(long id, PeriodicidadPagoDTO updateDTO);

    /**
     * Elimina una entidad PeriodicidadPago por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<PeriodicidadPago>
     */
    List<PeriodicidadPago> findByContrato(Contrato contrato);

}
