package Nomina.seguridad.persistence.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "objeto")
public class Objeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nombreObjeto", nullable = false)
    private String nombreObjeto;

    @ManyToOne
    @JoinColumn(name = "tipo_objeto_id", nullable = false)
    private TipoObjeto tipoObjeto;

}