package Nomina.seguridad.persistence.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "accion_objeto")
public class AccionObjeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "accion_id", nullable = false)
    private Accion accion;

    @ManyToOne
    @JoinColumn(name = "objeto_id", nullable = false)
    private Objeto objeto;
}
