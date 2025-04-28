package Nomina.seguridad.Interceptor;
import Nomina.seguridad.service.impl.AuthenticationService;
import Nomina.seguridad.service.impl.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class PermisoInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private SecurityContextPersonalizado securityContextPersonalizado;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Manejar solicitudes OPTIONS (preflight)
        if (request.getMethod().equalsIgnoreCase("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return false;
        }

        // Excluir rutas específicas
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/auth/") || requestURI.startsWith("/api/generacion")
                || requestURI.equals("/proyectos") || requestURI.equals("/proyectos/eliminarProyecto")
                || requestURI.equals("/notificar") || requestURI.equals("/authGitHub/github")) {
            return true;
        }

        if (requestURI.matches("/api/[^/]+/download") || requestURI.matches("^/api/[^/]+/[^/]+/files$")) {
            return true; // Permitir sin validaciones
        }


        if (requestURI.matches("^/api/[^/]+/notificar$")) {
            return true; // Permitir sin validaciones
        }


        if (requestURI.matches("^/api/email-config$")) {
            return true; // Permitir sin validaciones
        }

        // Configurar la respuesta
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Obtener encabezados personalizados
        String accion = request.getHeader("Accion");
        String objeto = request.getHeader("Objeto");

        if (accion == null || accion.isEmpty()) {
            return enviarError(response, HttpServletResponse.SC_BAD_REQUEST, "No se envió la acción.");
        }

        if (objeto == null || objeto.isEmpty()) {
            return enviarError(response, HttpServletResponse.SC_BAD_REQUEST, "No se envió el objeto.");
        }

        // Extraer y validar el token
        String token = jwtTokenService.extractJwtFromRequest(request);
        if (token == null || token.isEmpty()) {
            return enviarError(response, HttpServletResponse.SC_UNAUTHORIZED, "No se envió el token correctamente.");
        }

        try {
            Date expiration = jwtTokenService.obtenerExpiration(token);
            if (expiration.before(new Date())) {
                return enviarError(response, HttpServletResponse.SC_UNAUTHORIZED, "El token ha expirado.");
            }

            String userName = jwtTokenService.obtenerUsername(token);
            List<String> rolesUsuario = jwtTokenService.obtenerRoles(token); // Obtener lista de roles
            securityContextPersonalizado.setRoles(rolesUsuario);
            boolean tieneRolNoAdministrador = (boolean) jwtTokenService.extractAllClaims(token).get("tieneRolNoAdministrador");

            //Verificar si el usuario tiene el rol "CONTADOR"
            boolean esContador = rolesUsuario.contains("CONTADOR");
            // Verificar si es Admin o Gerente
            boolean esAdminGerente = rolesUsuario.contains("ADMINISTRADOR") || rolesUsuario.contains("GERENTE");

            //Guardar en el contexto de seguridad
            securityContextPersonalizado.setUsuarioActual(userName);
            securityContextPersonalizado.setTieneRolNoAdministrador(tieneRolNoAdministrador);
            securityContextPersonalizado.setEsContador(esContador);
            securityContextPersonalizado.setEsAdminGerente(esAdminGerente);


            boolean tienePermiso = authenticationService.verificarPermiso(userName, jwtTokenService.obtenerRoles(token), accion, objeto);
            if (!tienePermiso) {
                return enviarError(response, HttpServletResponse.SC_UNAUTHORIZED, "No tiene permisos.");
            }

            return true;

        } catch (Exception e) {
            return enviarError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno: " + e.getMessage());
        }
    }

    private boolean enviarError(HttpServletResponse response, int statusCode, String mensaje) throws IOException {
        response.setStatus(statusCode);
        response.getWriter().write("{\"error\":\"" + mensaje + "\"}");
        return false;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String requestURI = request.getRequestURI();

        // Si la petición NO es a la API, limpiar el contexto
        if (!requestURI.startsWith("/api/")) {
            securityContextPersonalizado.limpiar();
        }
    }

}