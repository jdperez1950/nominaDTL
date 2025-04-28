package Nomina.seguridad.persistence.repository;

import Nomina.seguridad.persistence.entities.AccionObjeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccionObjetoRepository extends JpaRepository<AccionObjeto, Long> {
    @Query("SELECT ao FROM AccionObjeto ao " +
           "JOIN ao.accion a " +
           "JOIN ao.objeto o " +
           "WHERE a.nombre = :accionNombre AND o.nombreObjeto = :objetoNombre")
    Optional<AccionObjeto> findByAccionNombreAndObjetoNombreObjeto(
        @Param("accionNombre") String accionNombre,
        @Param("objetoNombre") String objetoNombre
    );
}

