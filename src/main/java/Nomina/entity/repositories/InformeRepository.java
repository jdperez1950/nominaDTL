package Nomina.entity.repositories;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Informe.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface InformeRepository extends JpaRepository<Informe, Long> {

    /**
     * Busca entidades Informe por su relación OneToOne con CuentaCobro.
     * @param cuentaCobro la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Informe> findByCuentaCobro(CuentaCobro cuentaCobro);

    /**
     * Busca entidades Informe por su relación ManyToOne con Proyecto.
     * @param proyecto la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Informe> findByProyecto(Proyecto proyecto);

    /**
     * Busca entidades Informe por su relación ManyToOne con Contrato.
     * @param contrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Informe> findByContrato(Contrato contrato);

}
