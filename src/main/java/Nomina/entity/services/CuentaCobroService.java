package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.CuentaCobroDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Informe;
import Nomina.entity.repositories.CuentaCobroRepository;
import Nomina.entity.services.CuentaCobroService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link CuentaCobro}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades CuentaCobro.</p>
 */
public interface CuentaCobroService {

    /**
     * Recupera todas las entidades CuentaCobro almacenadas.
     * @return Lista de todas las entidades CuentaCobro encontradas
     */
    List<CuentaCobro> findAll();

    /**
     * Busca una entidad CuentaCobro por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<CuentaCobro> findById(Long id);

    /**
     * Guarda una nueva entidad CuentaCobro en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad CuentaCobro creada y persistida
     */
    CuentaCobro save(CuentaCobroDTO dto);

    /**
     * Actualiza una entidad CuentaCobro existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad CuentaCobro actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    CuentaCobro update(long id, CuentaCobroDTO updateDTO);

    /**
     * Elimina una entidad CuentaCobro por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param contrato parámetro de tipo Contrato
     * @return List<CuentaCobro>
     */
    List<CuentaCobro> findByContrato(Contrato contrato);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param informe parámetro de tipo Informe
     * @return List<CuentaCobro>
     */
    List<CuentaCobro> findByInforme(Informe informe);

}
