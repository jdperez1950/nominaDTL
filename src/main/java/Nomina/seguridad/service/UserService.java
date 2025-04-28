package Nomina.seguridad.service;

import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.dto.SaveUser;
import Nomina.seguridad.dto.SaveUsuarioRol;
import Nomina.seguridad.persistence.entities.Usuario;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> getUsers();

    Usuario crearUsuario(SaveUser newUser);

    Boolean asignarRol(SaveUsuarioRol saveUsuarioRol);

    Boolean actualizarPrivilegio(AccionObjetoDTO permiso);

    boolean quitarRol(Long usuarioId, Long rolId);

    boolean eliminarUsuario(Long usuarioId);
}

