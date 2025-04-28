package Nomina.seguridad.persistence.repository;

import Nomina.seguridad.persistence.entities.TipoObjeto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoObjetoRepository extends JpaRepository<TipoObjeto, Long> {

    Optional<TipoObjeto> findByDescripcion(String descripcion);
}
