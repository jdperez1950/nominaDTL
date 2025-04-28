package Nomina.entity.repositories;

import jakarta.persistence.Column;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.TipoContrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad TipoContrato.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface TipoContratoRepository extends JpaRepository<TipoContrato, Long> {

    /**
     * Busca entidades TipoContrato por su relación OneToMany con Contrato.
     * @param contrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<TipoContrato> findByContrato(Contrato contrato);

}
