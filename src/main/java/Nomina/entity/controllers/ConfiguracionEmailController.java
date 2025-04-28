package Nomina.entity.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Nomina.entity.entities.ConfiguracionEmail;
import Nomina.entity.services.impl.ConfiguracionEmailServiceImpl;

/**
 * Controlador REST para la configuración de SMTP.
 */
@RestController
@RequestMapping("/api/email-config")
public class ConfiguracionEmailController {

    @Autowired
    private ConfiguracionEmailServiceImpl configuracionEmailService;

    @GetMapping
    public ResponseEntity<ConfiguracionEmail> getConfiguration() {
        return configuracionEmailService.getConfiguration()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<ConfiguracionEmail> updateConfiguration(@RequestBody ConfiguracionEmail config) {
        ConfiguracionEmail updated = configuracionEmailService.updateConfiguration(config);
        return ResponseEntity.ok(updated);
    }
}
