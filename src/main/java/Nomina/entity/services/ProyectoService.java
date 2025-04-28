package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.ProyectoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.repositories.ProyectoRepository;
import Nomina.entity.services.ProyectoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link Proyecto}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades Proyecto.</p>
 */
public interface ProyectoService {

    /**
     * Recupera todas las entidades Proyecto almacenadas.
     * @return Lista de todas las entidades Proyecto encontradas
     */
    List<Proyecto> findAll();

    /**
     * Busca una entidad Proyecto por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<Proyecto> findById(Long id);

    /**
     * Guarda una nueva entidad Proyecto en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad Proyecto creada y persistida
     */
    Proyecto save(ProyectoDTO dto);

    /**
     * Actualiza una entidad Proyecto existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad Proyecto actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    Proyecto update(long id, ProyectoDTO updateDTO);

    /**
     * Elimina una entidad Proyecto por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param persona parámetro de tipo Persona
     * @return List<Proyecto>
     */
    List<Proyecto> findByPersona(Persona persona);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<Proyecto>
     */
    List<Proyecto> findByContrato(Contrato contrato);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param informe parámetro de tipo Informe
     * @return List<Proyecto>
     */
    List<Proyecto> findByInforme(Informe informe);

    List<Proyecto> obtenerProyectosVisibles(Long personaId);

    /**
     * Obtiene las personas asociadas a un proyecto específico.
     *
     * @param proyectoId Identificador del proyecto
     * @return Lista de personas vinculadas al proyecto
     */
    public List<Persona> obtenerPersonasPorProyecto(Long proyectoId);

    /**
     * Obtiene las personas asociadas a un proyecto específico.
     *
     * @param proyectoId Identificador del proyecto
     * @return Lista de personas vinculadas al proyecto
     */
    List<Contrato> obtenerContratosPorProyecto(Long personaId, Long proyectoId);
}
