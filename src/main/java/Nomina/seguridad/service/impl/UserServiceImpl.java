package Nomina.seguridad.service.impl;

import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.dto.SaveUser;
import Nomina.seguridad.dto.SaveUsuarioRol;
import Nomina.seguridad.exception.ObjectNotFoundException;
import Nomina.seguridad.persistence.entities.Privilegio;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.Usuario;
import Nomina.seguridad.persistence.repository.PrivilegioRepository;
import Nomina.seguridad.persistence.repository.UserRepository;
import Nomina.seguridad.service.RoleService;
import Nomina.seguridad.service.UserService;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivilegioRepository privilegioRepository;

    @Autowired
    private RoleService roleService;

    @Autowired
    private NotificacionEmailServiceImpl notificacionEmailService;

    @Override
    public Optional<Usuario> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<Usuario> findByCorreo(String correo) {
        return userRepository.findByCorreo(correo);
    }


    @Override
    public List<Usuario> getUsers() {
        return userRepository.listarTodo();
    }

    @Override
    public Usuario crearUsuario(SaveUser newUser) {
        Usuario user = new Usuario();
        user.setUsername(newUser.getUsername());
        user.setName(newUser.getName());
        user.setCorreo(newUser.getCorreo());
        user.setPassword(newUser.getPassword());

        // Obtener el rol predeterminado y crear el conjunto de roles
        Rol defaultRole = roleService.findDefaultRole()
                .orElseThrow(() -> new RuntimeException("Default role not found."));
        Set<Rol> roles = new HashSet<>();
        roles.add(defaultRole);

        // Agregar roles adicionales si fueron seleccionados
        if (newUser.getRoles() != null && !newUser.getRoles().isEmpty()) {
            for (Long rolId : newUser.getRoles()) {
                roleService.findById(rolId)
                        .ifPresent(roles::add);
            }
        }

        // Asignar roles al usuario
        user.setRoles(roles);

        // Enviar correo con credenciales
        enviarCorreoCredenciales(user.getCorreo(), user.getName(), user.getUsername(), user.getPassword());

        // Guardar el usuario en la base de datos
        return userRepository.save(user);

    }

    /**
     * Método para enviar un correo con las credenciales del usuario
     */
    private void enviarCorreoCredenciales(String email, String nombre, String username, String password) {
        ObjectNode emailInfo = JsonNodeFactory.instance.objectNode();
        emailInfo.put("To", email);
        emailInfo.put("subject", "Credenciales de acceso al sistema");
        emailInfo.put("message", "Hola " + nombre +
                ",\n\nSe ha creado tu cuenta en el sistema.\n\nUsuario: " + username +
                "\nContraseña: " + password + "\n\n");

        try {
            CompletableFuture<String> future = notificacionEmailService.sendNotificationEmailAsync(
                    email, "Credenciales de acceso al sistema", emailInfo);
            String result = future.get(); // Esperamos la respuesta del email
            System.out.println("Correo enviado: " + result);
        } catch (Exception e) {
            System.err.println("Error al enviar correo: " + e.getMessage());
        }
    }

    @Override
    public Boolean asignarRol(SaveUsuarioRol saveUsuarioRol) throws IllegalArgumentException, ObjectNotFoundException {
        // Buscar el usuario por su nombre de usuario
        Usuario usuario = userRepository.findByUsername(saveUsuarioRol.getUsername())
                .orElseThrow(() -> new ObjectNotFoundException("Usuario no encontrado: " + saveUsuarioRol.getUsername()));

        // Iterar sobre los nombres de los roles proporcionados
        for (String nombreRol : saveUsuarioRol.getRoles()) {
            // Buscar el rol por su nombre
            Rol rol = roleService.findByNombre(nombreRol)
                    .orElseThrow(() -> new ObjectNotFoundException("Rol no encontrado: " + nombreRol));

            // Agregar el rol al usuario
            usuario.getRoles().add(rol);
        }

        // Guardar los cambios en la base de datos
        userRepository.save(usuario);

        return true;
    }

    @Override
    public Boolean actualizarPrivilegio(AccionObjetoDTO permiso) {
        Optional<Privilegio> privilegio = privilegioRepository.findById(permiso.getIdPrivilegio());
        if (!privilegio.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El permiso no existe");
        }

        Privilegio p = privilegio.get();
        p.setAutorizado(permiso.isAutorizado());

        privilegioRepository.save(p);
        return true;
    }

    @Override
    public boolean quitarRol(Long usuarioId, Long rolId) {
        // Buscar al usuario por su ID
        Usuario usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ObjectNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        // Buscar el rol por su ID
        Rol rol = roleService.findById(rolId)
                .orElseThrow(() -> new ObjectNotFoundException("Rol no encontrado con ID: " + rolId));

        // Eliminar el rol del conjunto de roles del usuario
        boolean removed = usuario.getRoles().remove(rol);

        if (removed) {
            // Guardar los cambios en la base de datos
            userRepository.save(usuario);
            return true;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El rol no está asignado al usuario");
        }
    }

    @Override
    public boolean eliminarUsuario(Long usuarioId) {
        Usuario usuario = userRepository.findById(usuarioId)
                .orElseThrow(() -> new ObjectNotFoundException("Usuario no encontrado"));

        userRepository.delete(usuario);
        return true;
    }

}