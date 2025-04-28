package Nomina.seguridad.service.impl;

import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.dto.PermisosDTO;
import Nomina.seguridad.dto.SaveUser;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.Usuario;
import Nomina.seguridad.persistence.repository.UserRepository;
import Nomina.seguridad.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    public boolean crearUsuario(SaveUser newUser) {

        // Validar si el correo ya está registrado
        Optional<Usuario> existingUser = userService.findByCorreo(newUser.getCorreo());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        // Validar si el correo ya está registrado
        Optional<Usuario> existingUserName = userService.findByUsername(newUser.getUsername());
        if (existingUserName.isPresent()) {
            throw new RuntimeException("El userName ya está registrado.");
        }

        // Si el correo no existe, proceder con el registro
        userService.crearUsuario(newUser);
        return true;
    }

    public Usuario authenticate(String username, String password) {
        // Busca al usuario por nombre de usuario
        Optional<Usuario> userOptional = userRepository.findByUsernameAndPassword(username, password);

        // Verifica si el usuario existe y si la contraseña coincide
        if (userOptional.isPresent()) {
            Usuario user = userOptional.get();
            return user;
        }
        return null;
    }

    public Usuario buscarUsuario(String username) {
        // Busca al usuario por nombre de usuario
        Optional<Usuario> userOptional = userRepository.findByUsername(username);

        // Verifica si el usuario existe
        if (userOptional.isPresent()) {
            Usuario user = userOptional.get();
            return user;
        }
        return null;
    }

    public PermisosDTO obtenerPermisos(Usuario usuario) {
        // Obtener los nombres de todos los roles asociados al usuario
        List<String> nombresRoles = usuario.getRoles()
                .stream()
                .map(Rol::getNombre)
                .collect(Collectors.toList());

        // Buscar permisos basados en el username y la lista de roles
        List<Object[]> resultados = userRepository.findPermisosByUsernameAndRoles(
                usuario.getUsername(),
                nombresRoles
        );

        List<AccionObjetoDTO> permisos = resultados.stream()
                .map(r -> new AccionObjetoDTO((Boolean) r[0], (String) r[1], (String) r[2], (String) r[3]))
                .toList();

        // Crear el DTO de respuesta
        PermisosDTO permisosDTO = new PermisosDTO();
        permisosDTO.setPermisos(new ArrayList<>(permisos));

        return permisosDTO;
    }

    public boolean verificarPermiso(String userName, List<String> roles, String accion, String objeto){
        List<Object[]> lista = userRepository.verificarPermiso(userName, roles, accion, objeto);
        if(lista.size() > 0){
            return true;
        }
        return false;
    }

}

