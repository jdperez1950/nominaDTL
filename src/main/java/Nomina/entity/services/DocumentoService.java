package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.DocumentoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Persona;
import Nomina.entity.repositories.DocumentoRepository;
import Nomina.entity.services.DocumentoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link Documento}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades Documento.</p>
 */
public interface DocumentoService {

    /**
     * Recupera todas las entidades Documento almacenadas.
     * @return Lista de todas las entidades Documento encontradas
     */
    List<Documento> findAll();

    /**
     * Busca una entidad Documento por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<Documento> findById(Long id);

    /**
     * Guarda una nueva entidad Documento en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad Documento creada y persistida
     */
    Documento save(DocumentoDTO dto);

    /**
     * Actualiza una entidad Documento existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad Documento actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    Documento update(long id, DocumentoDTO updateDTO);

    /**
     * Elimina una entidad Documento por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param persona parámetro de tipo Persona
     * @return List<Documento>
     */
    List<Documento> findByPersona(Persona persona);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<Documento>
     */
    List<Documento> findByContrato(Contrato contrato);

}
