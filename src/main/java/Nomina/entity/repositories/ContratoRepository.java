package Nomina.entity.repositories;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.PeriodicidadPago;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.entities.TipoContrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Contrato.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    /**
     * Busca entidades Contrato por su relación ManyToOne con Proyecto.
     * @param proyecto la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByProyecto(Proyecto proyecto);

    /**
     * Busca entidades Contrato por su relación ManyToOne con Persona.
     * @param persona la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByPersona(Persona persona);

    /**
     * Busca entidades Contrato por su relación OneToMany con Documento.
     * @param documento la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByDocumento(Documento documento);

    /**
     * Busca entidades Contrato por su relación OneToMany con CuentaCobro.
     * @param cuentaCobro la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByCuentaCobro(CuentaCobro cuentaCobro);

    /**
     * Busca entidades Contrato por su relación ManyToOne con TipoContrato.
     * @param tipoContrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByTipoContrato(TipoContrato tipoContrato);

    /**
     * Busca entidades Contrato por su relación ManyToOne con PeriodicidadPago.
     * @param periodicidadPago la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByPeriodicidadPago(PeriodicidadPago periodicidadPago);

    /**
     * Busca entidades Contrato por su relación OneToMany con Informe.
     * @param informe la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Contrato> findByInforme(Informe informe);

    List<Contrato> findByPersonaId(Long personaId);


}
