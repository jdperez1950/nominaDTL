package Nomina.entity.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "gerente")
@DiscriminatorValue("GERENTE")
@Getter
@Setter
public class Gerente extends Persona {

    private String experienciaProfesional;

    public Gerente() {}
}
