package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.InformeDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.repositories.InformeRepository;
import Nomina.entity.services.InformeService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link Informe}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades Informe.</p>
 */
public interface InformeService {

    /**
     * Recupera todas las entidades Informe almacenadas.
     * @return Lista de todas las entidades Informe encontradas
     */
    List<Informe> findAll();

    /**
     * Busca una entidad Informe por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<Informe> findById(Long id);

    /**
     * Guarda una nueva entidad Informe en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad Informe creada y persistida
     */
    Informe save(InformeDTO dto);

    /**
     * Actualiza una entidad Informe existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad Informe actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    Informe update(long id, InformeDTO updateDTO);

    /**
     * Elimina una entidad Informe por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param cuentaCobro parámetro de tipo CuentaCobro
     * @return List<Informe>
     */
    List<Informe> findByCuentaCobro(CuentaCobro cuentaCobro);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param proyecto parámetro de tipo Proyecto
     * @return List<Informe>
     */
    List<Informe> findByProyecto(Proyecto proyecto);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<Informe>
     */
    List<Informe> findByContrato(Contrato contrato);

}
