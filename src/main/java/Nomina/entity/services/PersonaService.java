package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.PersonaDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.entities.TipoDocumento;
import Nomina.entity.repositories.PersonaRepository;
import Nomina.entity.services.PersonaService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link Persona}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades Persona.</p>
 */
public interface PersonaService {

    /**
     * Recupera todas las entidades Persona almacenadas.
     * @return Lista de todas las entidades Persona encontradas
     */
    List<Persona> findAll();

    /**
     * Busca una entidad Persona por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<Persona> findById(Long id);

    /**
     * Guarda una nueva entidad Persona en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad Persona creada y persistida
     */
    Persona save(PersonaDTO dto);

    /**
     * Actualiza una entidad Persona existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad Persona actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    Persona update(long id, PersonaDTO updateDTO);

    /**
     * Elimina una entidad Persona por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param proyecto parámetro de tipo Proyecto
     * @return List<Persona>
     */
    List<Persona> findByProyecto(Proyecto proyecto);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<Persona>
     */
    List<Persona> findByContrato(Contrato contrato);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param documento parámetro de tipo Documento
     * @return List<Persona>
     */
    List<Persona> findByDocumento(Documento documento);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param tipoDocumento parámetro de tipo TipoDocumento
     * @return List<Persona>
     */
    List<Persona> findByTipoDocumento(TipoDocumento tipoDocumento);

}
