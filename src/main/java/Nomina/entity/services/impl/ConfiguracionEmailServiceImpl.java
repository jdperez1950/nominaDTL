package Nomina.entity.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Nomina.entity.entities.ConfiguracionEmail;
import Nomina.entity.repositories.ConfiguracionEmailRepository;
import java.util.Optional;

@Service
public class ConfiguracionEmailServiceImpl {

    @Autowired
    private ConfiguracionEmailRepository repository;

    public Optional<ConfiguracionEmail> getConfiguration() {
        return repository.findAll().stream().findFirst();
    }

    public ConfiguracionEmail updateConfiguration(ConfiguracionEmail config) {
        return repository.save(config);
    }
}
