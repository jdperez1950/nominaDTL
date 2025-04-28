/**
 * Contrato.java
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
 * Entidad que representa contrato en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="contrato")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//@Filter(name = "filtroCreador", condition = "creador = :creador")
public class Contrato implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="contrato_id", nullable=false)
    private long id;
    /**
     * numero del contrato
     *
     * Restricciones:
     */
    @Column(name="numeroContrato", nullable=false)
    private String numeroContrato;

    /**
     * cargo del contratista
     * 
     * Restricciones:
     */
    @Column(name="cargo", nullable=false)
    private String cargo;

    /**
     * valor total del contrato
     * 
     * Restricciones:
     */
    @Column(name="valorTotalContrato", nullable=false)
    private long valorTotalContrato;

    /**
     * numero de pagos a realizar
     * 
     * Restricciones:
     */
    @Column(name="numeroPagos", nullable=false)
    private int numeroPagos;

    /**
     * fecha de inicio del contrato
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaInicioContrato", nullable=false)
    private LocalDate fechaInicioContrato;

    /**
     * fecha finalizacion del contrato
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaFinContrato", nullable=false)
    private LocalDate fechaFinContrato;

    /**
     * estado del contrato
     * 
     * Restricciones:
     */
    @Column(name="estado", nullable=false)
    private boolean estado;

    /**
     * ruta del archivo
     * 
     * Restricciones:
     */
    @Column(name="contratoPdf", nullable=false)
    private String contratoPdf;

    /**
     * booleano si el contrato esta firmado o no
     * 
     * Restricciones:
     */
    @Column(name="firmado")
    private boolean firmado;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * Observaciones adicionales del contrato
     *
     * Restricciones: Opcional
     */
    @Column(name="observaciones", nullable=true)
    private String observaciones;

    /**
     * Archivos adicionales del contrato
     *
     * Restricciones: Opcional
     */
    @FilePath(type = "file")
    @Column(name="archivosAdicionales", nullable=true)
    private String archivosAdicionales;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
    @JoinColumn(name = "proyecto", nullable = true)
    private Proyecto proyecto;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "persona")
    private Persona persona;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "contrato", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Documento> documento;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "contrato", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<CuentaCobro> cuentaCobro;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "tipoContrato")
    private TipoContrato tipoContrato;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "periodicidadPago")
    private PeriodicidadPago periodicidadPago;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "contrato", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Informe> informe;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de Contrato con los valores especificados.
     *
     * @param cargo cargo del contratista
     * @param valorTotalContrato valor total del contrato
     * @param numeroPagos numero de pagos a realizar
     * @param fechaInicioContrato fecha de inicio del contrato
     * @param fechaFinContrato fecha finalizacion del contrato
     * @param estado estado del contrato
     * @param contratoPdf ruta del archivo
     * @param firmado booleano si el contrato esta firmado o no
     * @param proyecto 
     * @param persona 
     * @param tipoContrato 
     * @param periodicidadPago 
     * @param creador Columna que representa el creador de la entidad.
     */
    public Contrato(String numeroContrato,String cargo, long valorTotalContrato, int numeroPagos, LocalDate fechaInicioContrato, LocalDate fechaFinContrato, boolean estado, String contratoPdf, boolean firmado, Proyecto proyecto, Persona persona, TipoContrato tipoContrato, PeriodicidadPago periodicidadPago, String creador) {
        this.numeroContrato = numeroContrato;
        this.cargo = cargo;
        this.valorTotalContrato = valorTotalContrato;
        this.numeroPagos = numeroPagos;
        this.fechaInicioContrato = fechaInicioContrato;
        this.fechaFinContrato = fechaFinContrato;
        this.estado = estado;
        this.contratoPdf = contratoPdf;
        this.firmado = firmado;
        this.proyecto = proyecto;
        this.persona = persona;
        this.tipoContrato = tipoContrato;
        this.periodicidadPago = periodicidadPago;
        this.creador = creador;
    }

}
