package Nomina.entity.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_configuration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String host;

    private Integer port;

    private String username;

    private String password;

    private Boolean auth;

    private Boolean starttlsEnable;

}
