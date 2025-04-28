package Nomina.seguridad.persistence.entities;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tipo_objeto")
public class TipoObjeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "clase_name", nullable = false)
    private String claseName;
}
