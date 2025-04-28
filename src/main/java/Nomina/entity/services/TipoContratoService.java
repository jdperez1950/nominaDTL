package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.TipoContratoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.TipoContrato;
import Nomina.entity.repositories.TipoContratoRepository;
import Nomina.entity.services.TipoContratoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link TipoContrato}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades TipoContrato.</p>
 */
public interface TipoContratoService {

    /**
     * Recupera todas las entidades TipoContrato almacenadas.
     * @return Lista de todas las entidades TipoContrato encontradas
     */
    List<TipoContrato> findAll();

    /**
     * Busca una entidad TipoContrato por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<TipoContrato> findById(Long id);

    /**
     * Guarda una nueva entidad TipoContrato en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad TipoContrato creada y persistida
     */
    TipoContrato save(TipoContratoDTO dto);

    /**
     * Actualiza una entidad TipoContrato existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad TipoContrato actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    TipoContrato update(long id, TipoContratoDTO updateDTO);

    /**
     * Elimina una entidad TipoContrato por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<TipoContrato>
     */
    List<TipoContrato> findByContrato(Contrato contrato);

}
