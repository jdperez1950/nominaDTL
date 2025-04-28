package Nomina.seguridad.persistence.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;

    @Column(name = "esadministrador", nullable = false)
    private boolean esAdministrador;

    // Relación One-to-Many para los roles hijos
    /*@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "rol_padre_id") // FK en la tabla de roles hijos
    private Set<Rol> rolesHijos = new HashSet<>();*/

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY) // Configuración de carga perezosa
    @JoinTable(
            name = "rol_jerarquia", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "rol_padre_id"), // Llave del rol padre
            inverseJoinColumns = @JoinColumn(name = "rol_hijo_id") // Llave del rol hijo
    )
    private Set<Rol> rolesHijos = new HashSet<>();


    @ManyToMany(mappedBy = "rolesHijos", fetch = FetchType.LAZY)
    private Set<Rol> rolesPadres = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<Usuario> usuarios = new HashSet<>();


    // Constructor vacío requerido por Hibernate
    public Rol() {
    }

    // Constructor para facilitar creación de roles
    public Rol(String nombre) {
        this.nombre = nombre;
    }
}