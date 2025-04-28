/**
 * Persona.java
 * Generado automáticamente el 13/03/2025 16:31:54
 */

package Nomina.entity.entities;

import Nomina.seguridad.persistence.entities.Usuario;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import Nomina.entity.annotations.FilePath;
import lombok.*;
import java.util.*;
import java.math.*;
import java.time.*;
import java.io.Serializable;
import Nomina.seguridad.persistence.entities.Objeto;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

/**
 * Entidad que representa persona en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="persona")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Filter(name = "filtroCreador", condition = "creador = :creador")
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="persona_id", nullable=false)
    private long id;

    /**
     * nombre de la persona
     * 
     * Restricciones:
     */
    @Column(name="nombre", nullable=false)
    private String nombre;

    /**
     * correo de  la persona
     * 
     * Restricciones:
     */
    @Column(name="correo", nullable=false)
    private String correo;

    /**
     * numero de documento de identidad de la persona
     * 
     * Restricciones:
     */
    @Column(name="numeroDocumento", nullable=false)
    private String numeroDocumento;

    /**
     * titulo profesional de la persona
     * 
     * Restricciones:
     */
    @Column(name="tituloProfesional", nullable=false)
    private String tituloProfesional;

    /**
     * direccion de la persona
     * 
     * Restricciones:
     */
    @Column(name="direccion", nullable=false)
    private String direccion;

    /**
     * telefono de la persona
     * 
     * Restricciones:
     */
    @Column(name="telefono", nullable=false)
    private String telefono;

    @OneToOne(mappedBy = "persona", cascade = CascadeType.ALL)
    private Usuario usuario;

    /**
     * fecha expedicion del documento de identidad de la persona
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaExpedicion", nullable=false)
    private LocalDate fechaExpedicion;

    /**
     * fecha nacimiento de la persona
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaNacimiento", nullable=false)
    private LocalDate fechaNacimiento;

    /**
     * nacionalidad de la persona
     * 
     * Restricciones:
     */
    @Column(name="nacionalidad", nullable=false)
    private String nacionalidad;

    /**
     * Archivos adicionales del contrato
     *
     * Restricciones: Opcional
     */
    @FilePath(type = "file")
    @Column(name="documentosFormacionAcademica", nullable=true)
    private String documentosFormacionAcademica;

    /**
     * Archivos adicionales del contrato
     *
     * Restricciones: Opcional
     */
    @FilePath(type = "file")
    @Column(name="documentosLegales", nullable=true)
    private String documentosLegales;

    /**
     * Archivos adicionales del contrato
     *
     * Restricciones: Opcional
     */
    @FilePath(type = "file")
    @Column(name="certificacionesLaborales", nullable=true)
    private String certificacionesLaborales;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: Many to Many
     */
    @ToString.Exclude
    @ManyToMany(mappedBy = "persona", fetch = FetchType.LAZY) @JsonIgnore
    private List<Proyecto> proyecto;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "persona", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Contrato> contrato;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "persona", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Documento> documento;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "tipoDocumento")
    private TipoDocumento tipoDocumento;

    @Column(name = "necesita_acceso")
    private boolean necesitaAcceso;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de Persona con los valores especificados.
     *
     * @param nombre nombre de la persona
     * @param correo correo de  la persona
     * @param numeroDocumento numero de documento de identidad de la persona
     * @param tituloProfesional titulo profesional de la persona
     * @param direccion direccion de la persona
     * @param telefono telefono de la persona
     * @param fechaExpedicion fecha expedicion del documento de identidad de la persona
     * @param fechaNacimiento fecha nacimiento de la persona
     * @param nacionalidad nacionalidad de la persona
     * @param tipoDocumento 
     * @param creador Columna que representa el creador de la entidad.
     */
    public Persona(String nombre, String correo, String numeroDocumento, String tituloProfesional, String direccion, String telefono, LocalDate fechaExpedicion, LocalDate fechaNacimiento, String nacionalidad, TipoDocumento tipoDocumento, String creador) {
        this.nombre = nombre;
        this.correo = correo;
        this.numeroDocumento = numeroDocumento;
        this.tituloProfesional = tituloProfesional;
        this.direccion = direccion;
        this.telefono = telefono;
        this.fechaExpedicion = fechaExpedicion;
        this.fechaNacimiento = fechaNacimiento;
        this.nacionalidad = nacionalidad;
        this.tipoDocumento = tipoDocumento;
        this.creador = creador;
    }

}
