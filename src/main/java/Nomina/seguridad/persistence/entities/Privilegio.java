package Nomina.seguridad.persistence.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "privilegio", uniqueConstraints = @UniqueConstraint(columnNames = {"accion_objeto_id", "rol_id", "usuario_id"}))
public class Privilegio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "accion_objeto_id", nullable = false)
    private AccionObjeto accionObjeto;

    @ManyToOne
    @JoinColumn(name = "rol_id", nullable = true)
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;

    @Column(nullable = false)
    private Boolean autorizado = true;
}