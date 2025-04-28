package Nomina.entity.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "contador")
@DiscriminatorValue("CONTADOR")
@Getter
@Setter
public class Contador extends Persona {

    private String numeroTarjetaProfesional;

    public Contador() {}
}

