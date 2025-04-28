package Nomina.seguridad.controller;
import Nomina.entity.services.impl.NotificacionEmailServiceImpl;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import Nomina.seguridad.dto.*;
import Nomina.seguridad.exception.ObjectNotFoundException;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.Usuario;
import Nomina.seguridad.service.RoleService;
import Nomina.seguridad.service.UserService;
import Nomina.seguridad.service.impl.AuthenticationService;
import Nomina.seguridad.service.impl.DynamicEntityService;
import Nomina.seguridad.service.impl.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {
        "http://localhost:*",
        "https://www.datentity.org",
        "https://datentity.org"
})
@RequestMapping("/auth")
public class Authentication {

    @Autowired
    private DynamicEntityService dynamicEntityService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificacionEmailServiceImpl notificacionEmailServiceImpl;

    @Autowired
    private JwtTokenService jwtTokenService;
    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody @Valid AuthenticationRequest authenticationRequest) {
        Usuario usuario = authenticationService.authenticate(
                authenticationRequest.getUsername(),
                authenticationRequest.getPassword()
        );

        if (usuario != null) {
            PermisosDTO dto = new PermisosDTO();
            String token = jwtTokenService.generateToken(usuario);
            dto.setToken(token);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String>logout(HttpServletRequest request){
        return ResponseEntity.ok("logout exitoso");
    }
    @PostMapping("/crearUsuario")
    public ResponseEntity<Boolean> crearUsuario(@RequestBody @Valid SaveUser newUser){
        boolean resultado =  authenticationService.crearUsuario(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @PostMapping("/prueba")
    public ResponseEntity<String> prueba(@RequestBody @Valid SaveUser newUser){
        return ResponseEntity.status(HttpStatus.CREATED).body("esto es una prueba");
    }

    @PostMapping("/crearRol")
    public ResponseEntity<Rol> crearRol(@RequestBody Rol newRol){
        Rol rolNuevo = roleService.crearRol(newRol);
        return ResponseEntity.status(HttpStatus.CREATED).body(rolNuevo);
    }

    @GetMapping("/getRoles")
    public ResponseEntity<List<RolDTO>> getRoles() {
        List<RolDTO> roles = roleService.getRoles();
        if (!roles.isEmpty()) {
            return ResponseEntity.ok(roles);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<Usuario>> getUsers(){

        List<Usuario> listUsers = userService.getUsers();
        if(!listUsers.isEmpty()){
            return ResponseEntity.ok(listUsers);
        }

        return ResponseEntity.notFound().build();
    }

    // asignar un rol a un usuario
    @PostMapping("/asignarRol")
    public ResponseEntity<Boolean> asignarRol(@RequestBody @Valid SaveUsuarioRol saveUsuarioRol){
        boolean resultado = userService.asignarRol(saveUsuarioRol);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @DeleteMapping("/quitarRol")
    public ResponseEntity<Boolean> quitarRol(@RequestParam Long usuarioId, @RequestParam Long rolId) {
        try {
            if (usuarioId == 1) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(false);
            }

            boolean resultado = userService.quitarRol(usuarioId, rolId);
            return ResponseEntity.ok(resultado);
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @DeleteMapping("/quitarRolHijo")
    public ResponseEntity<Boolean> quitarRolHijo(@RequestParam Long rolPadreId, @RequestParam Long rolHijoId) {
        try {
            boolean resultado = roleService.quitarRolHijo(rolPadreId, rolHijoId);
            return ResponseEntity.ok(resultado);
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    //agregar un rol a otro rol
    @PostMapping("/agregarRol")
    public ResponseEntity<Boolean> agregarRol(@RequestBody @Valid SaveRolRol saveRolRol){
        boolean resultado = roleService.agregarRol(saveRolRol);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @GetMapping("/buscarObjeto")
    public List<?> buscarObjeto(@RequestParam String tipoObjeto, HttpServletRequest request) {
        try {
            // Extraer el token JWT desde el encabezado
            String token = jwtTokenService.extractJwtFromRequest(request);

            Usuario usuario = authenticationService.buscarUsuario(jwtTokenService.obtenerUsername(token));
            PermisosDTO permisos = authenticationService.obtenerPermisos(usuario);

            // Filtrar los permisos por tipoObjeto y extraer el campo "objeto"
            List<String> nombreObjetos = permisos.getPermisos().stream()
                    .filter(permiso -> tipoObjeto.equals(permiso.getTipoObjeto())) // Filtrar por tipoObjeto
                    .map(permiso -> permiso.getObjeto()) // Extraer el campo "objeto"
                    .collect(Collectors.toList());

            // Pasar el resultado filtrado al servicio dinámico
            return dynamicEntityService.findByDescripcionAndNombreObjetos(tipoObjeto, nombreObjetos);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al buscar objetos");
        }
    }

    //Obtiene los permisos de un rol
    @GetMapping("/permisos")
    public ResponseEntity<List<AccionObjetoDTO>> permisosPorRolOUsuario(@RequestParam(defaultValue = "-1") Long rolID,@RequestParam(defaultValue = "-1") Long usuarioID) {
        try {
            List<AccionObjetoDTO> permisos = roleService.getPermisosPorRolOUsuario(rolID, usuarioID);
            return ResponseEntity.ok(permisos);
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/actualizarPrivilegio")
    public ResponseEntity<Boolean> actualizarPrivilegio(@RequestBody AccionObjetoDTO permiso){
        boolean estado = userService.actualizarPrivilegio(permiso);
        return ResponseEntity.status(HttpStatus.OK).body(estado);
    }

    @DeleteMapping("/eliminarUsuario")
    public ResponseEntity<Boolean> eliminarUsuario(@RequestParam Long usuarioId) {
        try {
            if (usuarioId == 1) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(false);
            }

            boolean resultado = userService.eliminarUsuario(usuarioId);
            return ResponseEntity.ok(resultado);
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @DeleteMapping("/eliminarRolPadre")
    public ResponseEntity<Boolean> eliminarRolPadre(@RequestParam Long rolPadreId) {
        try {
            if (rolPadreId == 1) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(false);
            }

            boolean resultado = roleService.eliminarRolPadre(rolPadreId);
            return ResponseEntity.ok(resultado);
        } catch (ObjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }


    @PostMapping("/verificar-correo")
    public ResponseEntity<?> verificarCorreo(@RequestBody Map<String, String> body) {
        try {
            String correo = body.get("correo");
            if (correo == null || correo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo es requerido"));
            }

            Optional<Usuario> usuarioOptional = userService.findByCorreo(correo);

            if (usuarioOptional.isPresent()) {
                // Si el usuario existe, generamos el token y enviamos los permisos
                Usuario usuario = usuarioOptional.get();
                String token = jwtTokenService.generateToken(usuario);
                PermisosDTO permisosDTO = authenticationService.obtenerPermisos(usuario);

                Map<String, Object> response = Map.of(
                        "existe", true,
                        "token", token,
                        "permisos", permisosDTO
                );

                return ResponseEntity.ok(response);
            } else {
                // Si el usuario no existe
                return ResponseEntity.ok(Map.of("existe", false));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al verificar el correo"));
        }
    }

    @PostMapping("/notificar")
    public ResponseEntity<String> notificar(@RequestBody JsonNode info) {
        if (!info.has("To") || info.get("To").asText().isEmpty()) {
            return ResponseEntity.badRequest().body("El campo 'To' es obligatorio para enviar la notificación");
        }
        String toEmail = info.get("To").asText();
        try {
            // Llamada asíncrona al servicio
            java.util.concurrent.CompletableFuture<String> future = notificacionEmailServiceImpl.sendNotificationEmailAsync(
                    toEmail, "Notificación de Cliente", info);

            // Obtener el resultado del future (bloquea hasta que se complete)
            String result = future.get();
            System.out.println("Test SMTP: " + result);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.err.println("Test SMTP error: " + e.getMessage());
            if (e.getMessage().contains("401") || e.getMessage().contains("400")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            } else if (e.getMessage().contains("500")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error al obtener resultado del future: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}