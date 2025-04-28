/**
 * Proyecto.java
 * Generado automáticamente el 13/03/2025 16:31:54
 */

package Nomina.entity.entities;

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
 * Entidad que representa proyecto en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="proyecto")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//@Filter(name = "filtroCreador", condition = "creador = :creador")
public class Proyecto implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="proyecto_id", nullable=false)
    private long id;

    /**
     * nombre del proyecto
     * 
     * Restricciones:
     */
    @Column(name="nombre", nullable=false)
    private String nombre;

    /**
     * valor del contrato
     * 
     * Restricciones:
     */
    @Column(name="valorContrato", nullable=false)
    private long valorContrato;

    /**
     * tiempo de contrato(duracion contrato)
     * 
     * Restricciones:
     */
    @Column(name="tiempoContractual", nullable=false)
    private String tiempoContractual;

    /**
     * objeto del contrato
     * 
     * Restricciones:
     */
    @FilePath(type = "text")
    @Column(name="objetoContractual", nullable=false)
    private String objetoContractual;

    /**
     * alcance del contrato
     * 
     * Restricciones:
     */
    @FilePath(type = "text")
    @Column(name="alcanceContractual", nullable=false)
    private String alcanceContractual;

    /**
     * estado del proyecto
     * 
     * Restricciones:
     */
    @Column(name="estado", nullable=false)
    private boolean estado;

    /**
     * numero de contrato
     * 
     * Restricciones:
     */
    @Column(name="numeroContrato", nullable=false)
    private String numeroContrato;

    /**
     * cliente que realiza la contratacion
     * 
     * Restricciones:
     */
    @Column(name="cliente", nullable=false)
    private String cliente;

    /**
     * fecha de inicio del contrato
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaInicio", nullable=false)
    private LocalDate fechaInicio;

    /**
     * fecha de finalizacion del contrato
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaFin", nullable=false)
    private LocalDate fechaFin;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: Many to Many
     */
    @ManyToMany(fetch = FetchType.EAGER) @JoinTable(name = "persona_proyecto", joinColumns = @JoinColumn(name = "proyecto"), inverseJoinColumns = @JoinColumn(name = "persona"))
    private List<Persona> persona;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "proyecto", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Contrato> contrato;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "proyecto", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Informe> informe;

    /**
     * Supervisor del proyecto
     */
    @Column(name="supervisor", nullable=false)
    private String supervisor;

    /**
     * Contacto del supervisor del proyecto
     * Restricciones:
     */
    @Column(name="contactoSupervisor", nullable=false)
    private String contactoSupervisor;

    /**
     * Observaciones adicionales del proyecto
     *
     * Restricciones: Opcional
     */
    @Column(name="observaciones", nullable=true)
    private String observaciones;

    /**
     * Archivos adicionales del proyecto
     *
     * Restricciones: Opcional
     */
    @FilePath(type = "file")
    @Column(name="archivosAdicionales", nullable=true)
    private String archivosAdicionales;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de Proyecto con los valores especificados.
     *
     * @param nombre nombre del proyecto
     * @param valorContrato valor del contrato
     * @param tiempoContractual tiempo de contrato(duracion contrato)
     * @param objetoContractual objeto del contrato
     * @param alcanceContractual alcance del contrato
     * @param estado estado del proyecto
     * @param numeroContrato numero de contrato
     * @param cliente cliente que realiza la contratacion
     * @param fechaInicio fecha de inicio del contrato
     * @param fechaFin fecha de finalizacion del contrato
     * @param creador Columna que representa el creador de la entidad.
     *@param supervisor Supervisor del proyecto
     *@param contactoSupervisor Contacto del supervisor
     */
    public Proyecto(String nombre, long valorContrato, String tiempoContractual, String objetoContractual, String alcanceContractual, boolean estado, String numeroContrato, String cliente, LocalDate fechaInicio, LocalDate fechaFin, String creador, String supervisor, String contactoSupervisor) {
        this.nombre = nombre;
        this.valorContrato = valorContrato;
        this.tiempoContractual = tiempoContractual;
        this.objetoContractual = objetoContractual;
        this.alcanceContractual = alcanceContractual;
        this.estado = estado;
        this.numeroContrato = numeroContrato;
        this.cliente = cliente;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.creador = creador;
        this.supervisor = supervisor;
        this.contactoSupervisor = contactoSupervisor;
    }
}
