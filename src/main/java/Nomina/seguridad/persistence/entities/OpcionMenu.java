package Nomina.seguridad.persistence.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "opcion_menu")
@Getter
@Setter
public class OpcionMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID único para identificar la opción de menú

    @Column(name = "nav_cap", nullable = true) // Puede ser nulo
    private String navCap; // Agrupador de opciones (p. ej., "Home", "CitaMedica")

    @Column(name = "display_name", nullable = true) // Puede ser nulo
    private String displayName; // Nombre que se mostrará en el menú

    @Column(name = "icon_name", nullable = true) // Puede ser nulo
    private String iconName; // Nombre del ícono asociado

    @Column(name = "route", nullable = true) // Puede ser nulo
    private String route; // Ruta a la que redirige esta opción

    @Column(name = "nombreObjeto", nullable = false) // NO Puede ser nulo
    private String nombreObjeto;

    @Column(name = "orden", nullable = false) // No puede ser nulo
    private Integer orden; // Orden para mostrar las opciones de menú
}