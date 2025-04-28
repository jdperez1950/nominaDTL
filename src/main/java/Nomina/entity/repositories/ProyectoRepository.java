package Nomina.entity.repositories;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import java.util.List;
import java.util.Optional;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Persona;
import Nomina.entity.entities.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repositorio JPA para la entidad Proyecto.
 * Proporciona operaciones CRUD básicas y métodos personalizados de búsqueda
 * basados en los atributos y relaciones de la entidad.
 */
@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    /**
     * Busca entidades Proyecto por su relación ManyToMany con Persona.
     * @param persona la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Proyecto> findByPersona(Persona persona);

    /**
     * Busca entidades Proyecto por su relación OneToMany con Contrato.
     * @param contrato la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Proyecto> findByContrato(Contrato contrato);

    /**
     * Busca entidades Proyecto por su relación OneToMany con Informe.
     * @param informe la entidad relacionada a buscar
     * @return Lista de entidades que cumplen con la relación
     */
    List<Proyecto> findByInforme(Informe informe);

    @Query("SELECT p FROM Proyecto p JOIN p.persona personas WHERE personas.id = :personaId")
    List<Proyecto> findByPersonaId(@Param("personaId") Long personaId);


}
