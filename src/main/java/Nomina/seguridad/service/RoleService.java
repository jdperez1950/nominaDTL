package Nomina.seguridad.service;

import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.dto.RolDTO;
import Nomina.seguridad.dto.SaveRolRol;
import Nomina.seguridad.dto.SaveUsuarioRol;
import Nomina.seguridad.persistence.entities.Rol;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface RoleService {
    Optional<Rol> findDefaultRole();

    Optional<Rol> findByNombre(String name);

    Rol crearRol(Rol rol);


    List<RolDTO> getRoles();

    Boolean agregarRol(SaveRolRol saveRolRol);

    List<AccionObjetoDTO> getPermisosPorRolOUsuario(Long rolId, Long userId);

    Optional<Rol> findById(Long id);

    boolean quitarRolHijo(Long rolPadreId, Long rolHijoId);

    boolean eliminarRolPadre(Long rolPadreId);
}
