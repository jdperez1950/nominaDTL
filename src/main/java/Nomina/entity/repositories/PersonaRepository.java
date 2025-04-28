package Nomina.entity.repositories;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Documento;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.entities.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Persona.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

    /**
     * Busca entidades Persona por su relación ManyToMany con Proyecto.
     * @param proyecto la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Persona> findByProyecto(Proyecto proyecto);

    /**
     * Busca entidades Persona por su relación OneToMany con Contrato.
     * @param contrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Persona> findByContrato(Contrato contrato);

    /**
     * Busca entidades Persona por su relación OneToMany con Documento.
     * @param documento la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Persona> findByDocumento(Documento documento);

    /**
     * Busca entidades Persona por su relación ManyToOne con TipoDocumento.
     * @param tipoDocumento la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Persona> findByTipoDocumento(TipoDocumento tipoDocumento);

}
