package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.TipoDocumentoDTO;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.TipoDocumento;
import Nomina.entity.repositories.TipoDocumentoRepository;
import Nomina.entity.services.TipoDocumentoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link TipoDocumento}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades TipoDocumento.</p>
 */
public interface TipoDocumentoService {

    /**
     * Recupera todas las entidades TipoDocumento almacenadas.
     * @return Lista de todas las entidades TipoDocumento encontradas
     */
    List<TipoDocumento> findAll();

    /**
     * Busca una entidad TipoDocumento por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<TipoDocumento> findById(Long id);

    /**
     * Guarda una nueva entidad TipoDocumento en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad TipoDocumento creada y persistida
     */
    TipoDocumento save(TipoDocumentoDTO dto);

    /**
     * Actualiza una entidad TipoDocumento existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad TipoDocumento actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    TipoDocumento update(long id, TipoDocumentoDTO updateDTO);

    /**
     * Elimina una entidad TipoDocumento por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param persona parámetro de tipo Persona
     * @return List<TipoDocumento>
     */
    List<TipoDocumento> findByPersona(Persona persona);

}
