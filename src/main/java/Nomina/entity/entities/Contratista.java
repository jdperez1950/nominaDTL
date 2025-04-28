package Nomina.entity.entities;

import Nomina.entity.annotations.FilePath;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contratista")
@DiscriminatorValue("CONTRATISTA")
@Getter
@Setter
public class Contratista extends Persona {

    private String numeroTarjetaProfesional;
    private String experienciaProfesional;
    private String telefonoAdicional;

    public Contratista() {}
}

