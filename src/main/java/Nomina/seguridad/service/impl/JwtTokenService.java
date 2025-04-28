package Nomina.seguridad.service.impl;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class JwtTokenService {

    @Value("${security.jwt.expiration-in-minutes}")
    private Integer EXPIRATION_IN_MINUTES;

    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;

    public String generateToken(Usuario usuario) {

        Map<String, Object> extraClaims = generateExtraClaims(usuario);

        Date issuedAt = new Date(System.currentTimeMillis());
        Date expiration = new Date( (EXPIRATION_IN_MINUTES * 60 * 1000) + issuedAt.getTime() );

        String jwt = Jwts.builder()

                .header()
                .type("JWT")
                .and()

                .subject(usuario.getUsername())
                .issuedAt(issuedAt)
                .expiration(expiration)
                .claims(extraClaims)

                .signWith(generateKey(), Jwts.SIG.HS256)

                .compact();

        return jwt;
    }

    private SecretKey generateKey() {
        byte[] passwordDecoded = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(passwordDecoded);
    }

    private Map<String, Object> generateExtraClaims(Usuario usuario) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("name", usuario.getName());
        extraClaims.put("userId", usuario.getId());

        if (usuario.getPersona() != null) {
            extraClaims.put("personaId", usuario.getPersona().getId()); // Agregar ID de persona
        }

        // Extraer nombres de roles principales y sus hijos, y verificar si alguno tiene esAdministrador = false
        List<String> rolesYRolesHijos = usuario.getRoles()
                .stream()
                .flatMap(rol -> {
                    // Extraer el rol principal
                    Stream<String> rolPrincipal = Stream.of(rol.getNombre());

                    // Extraer los nombres de los roles hijos
                    Stream<String> rolesHijos = rol.getRolesHijos()
                            .stream()
                            .map(Rol::getNombre);

                    // Combinar el rol principal con sus hijos
                    return Stream.concat(rolPrincipal, rolesHijos);
                })
                .distinct() // Evitar duplicados
                .collect(Collectors.toList());

        // Verificar si alguno de los roles tiene esAdministrador = false
        boolean tieneRolNoAdministrador = usuario.getRoles()
                .stream()
                .anyMatch(rol -> !rol.isEsAdministrador());

        // Agregar las listas al mapa de claims
        extraClaims.put("roles", rolesYRolesHijos); // Lista de nombres de roles
        extraClaims.put("tieneRolNoAdministrador", tieneRolNoAdministrador); // Indicador de roles no administradores

        return extraClaims;
    }


    public String obtenerUsername(String jwt) {
        return extractAllClaims(jwt).getSubject();
    }

    public Claims extractAllClaims(String jwt) {
        return Jwts.parser().verifyWith( generateKey() ).build()
                .parseSignedClaims(jwt).getPayload();
    }

    public Date obtenerExpiration(String jwt) {
        return extractAllClaims(jwt).getExpiration();
    }

    public String obtenerNombrePropiedad(String jwt, String nombrePropiedad) {
        return (String) extractAllClaims(jwt).get(nombrePropiedad);
    }

    public List<Map<String, Object>> obtenerListaPermisos(String jwt, String nombrePropiedad) {
        return (List<Map<String, Object>>) extractAllClaims(jwt).get(nombrePropiedad);
    }

    public String extractJwtFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");//Bearer jwt
        if(!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")){
            return null;
        }
        return authorizationHeader.split(" ")[1];
    }

    public List<String> obtenerRoles(String jwt) {
        Claims claims = extractAllClaims(jwt);
        return (List<String>) claims.get("roles");
    }
}