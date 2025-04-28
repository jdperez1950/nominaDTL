package Nomina.entity.services;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.ContratoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.PeriodicidadPago;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.entities.TipoContrato;
import Nomina.entity.repositories.ContratoRepository;
import Nomina.entity.services.ContratoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona las operaciones de negocio para la entidad {@link Contrato}.
 * <p>Este servicio proporciona una capa de abstracción entre la capa de repositorio y la capa de controlador,
 * implementando la lógica de negocio necesaria para el manejo de entidades Contrato.</p>
 */
public interface ContratoService {

    /**
     * Recupera todas las entidades Contrato almacenadas.
     * @return Lista de todas las entidades Contrato encontradas
     */
    List<Contrato> findAll();

    /**
     * Busca una entidad Contrato por su identificador.
     * @param id Identificador único de la entidad
     * @return Optional que contiene la entidad si existe, vacío si no se encuentra
     */
    Optional<Contrato> findById(Long id);

    /**
     * Guarda una nueva entidad Contrato en la base de datos.
     * @param dto DTO con los datos de la entidad a crear
     * @return La entidad Contrato creada y persistida
     */
    Contrato save(ContratoDTO dto);

    /**
     * Actualiza una entidad Contrato existente.
     * @param id Identificador de la entidad a actualizar
     * @param updateDTO DTO con los nuevos datos de la entidad
     * @return La entidad Contrato actualizada
     * @throws RuntimeException si no se encuentra la entidad
     */
    Contrato update(long id, ContratoDTO updateDTO);

    /**
     * Elimina una entidad Contrato por su identificador.
     * @param id Identificador de la entidad a eliminar
     */
    void deleteById(Long id);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param proyecto parámetro de tipo Proyecto
     * @return List<Contrato>
     */
    List<Contrato> findByProyecto(Proyecto proyecto);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param persona parámetro de tipo Persona
     * @return List<Contrato>
     */
    List<Contrato> findByPersona(Persona persona);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param documento parámetro de tipo Documento
     * @return List<Contrato>
     */
    List<Contrato> findByDocumento(Documento documento);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param cuentaCobro parámetro de tipo CuentaCobro
     * @return List<Contrato>
     */
    List<Contrato> findByCuentaCobro(CuentaCobro cuentaCobro);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param tipoContrato parámetro de tipo TipoContrato
     * @return List<Contrato>
     */
    List<Contrato> findByTipoContrato(TipoContrato tipoContrato);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param periodicidadPago parámetro de tipo PeriodicidadPago
     * @return List<Contrato>
     */
    List<Contrato> findByPeriodicidadPago(PeriodicidadPago periodicidadPago);

    /**
     * Ejecuta una operación personalizada definida en el repositorio.
     * @param informe parámetro de tipo Informe
     * @return List<Contrato>
     */
    List<Contrato> findByInforme(Informe informe);

    List<Contrato> obtenerContratosVisibles(Long usuarioId);

    List<CuentaCobro> obtenerCuentasCobroPorContrato(String username,Long contratoId);

    /**
     * Obtiene los contratos asociados a una persona específica.
     *
     * @param personaId Identificador de la persona
     * @return Lista de contratos asociados a la persona
     */
    List<Contrato> findByPersonaId(Long personaId);

}
