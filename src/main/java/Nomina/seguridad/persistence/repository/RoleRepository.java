package Nomina.seguridad.persistence.repository;

import Nomina.seguridad.persistence.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String customer);

    Optional<Rol> findById(Long id);
}
