package Nomina.seguridad.controller;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder; // Importa esta clase
import org.springframework.core.ParameterizedTypeReference; // Importa esta clase

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/authGitHub/github")
@CrossOrigin(origins = {
        "http://localhost:*",
        "https://www.datentity.org",
        "https://datentity.org"
})


public class GitHubAuthController {

    private String clientId = "Ov23likeqVVWA4a7VMqX";

    private String clientSecret = "c903c1269a62508cb6e9be9fdd110a1c5c5a3e14";

    private final RestTemplate restTemplate = new RestTemplate();



    @PostMapping
    public ResponseEntity<Map<String, Object>> exchangeCodeForToken(@RequestBody String code) {
        // 1. Intercambiar el código por el token de acceso
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://github.com/login/oauth/access_token")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("code", code);

        String url = builder.toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, new ParameterizedTypeReference<Map<String, Object>>() {});

        // 2. Verificar la respuesta y obtener el token
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            String accessToken = (String) response.getBody().get("access_token");

            // 3. Obtener el email del usuario
            String email = getUserEmail(accessToken);

            // 4. Crear la respuesta con el token y el email
            Map<String, Object> result = new HashMap<>();
            result.put("access_token", accessToken);
            result.put("email", email);

            return ResponseEntity.ok(result);
        } else {
            System.err.println("Error al intercambiar el código por el token: " + response.getStatusCode() + " - " + response.getBody());
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }
    }

    private String getUserEmail(String accessToken) {
        String url = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            for (Map<String, Object> emailInfo : response.getBody()) {
                if ((boolean) emailInfo.get("primary") && (boolean) emailInfo.get("verified")) {
                    return (String) emailInfo.get("email");
                }
            }
            if (!response.getBody().isEmpty()) {
                return (String) response.getBody().get(0).get("email");
            }
        } else {
            System.err.println("Error al obtener el email del usuario: " + response.getStatusCode() + " - " + response.getBody());
        }

        return null;
    }


}