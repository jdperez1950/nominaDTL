package Nomina.seguridad.persistence.entities;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EntityScan(basePackages = "Nomina.seguridad.persistence.entities")
@ComponentScan(basePackages = "org.dtl360.dataentry")
public class JpaConfig {
    // Si necesitas más configuraciones, las puedes agregar aquí
}
