package Nomina.entity.repositories;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Documento.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    /**
     * Busca entidades Documento por su relación ManyToOne con Persona.
     * @param persona la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Documento> findByPersona(Persona persona);

    /**
     * Busca entidades Documento por su relación ManyToOne con Contrato.
     * @param contrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Documento> findByContrato(Contrato contrato);

}
