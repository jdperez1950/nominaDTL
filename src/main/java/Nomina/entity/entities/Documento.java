/**
 * Documento.java
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
 * Entidad que representa documento en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="documento")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@FilterDef(name = "filtroCreador", parameters = @ParamDef(name = "creador", type = String.class))
@Filter(name = "filtroCreador", condition = "creador = :creador")
public class Documento implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="documento_id", nullable=false)
    private long id;

    /**
     * nombre del documento
     * 
     * Restricciones:
     */
    @Column(name="nombre", nullable=false)
    private String nombre;

    /**
     * descripcion del documento
     * 
     * Restricciones:
     */
    @FilePath(type = "text")
    @Column(name="descripcion", nullable=false)
    private String descripcion;

    /**
     * fecha en que se sube el documento al sistema
     * 
     * Restricciones:
     */
    @Temporal(TemporalType.DATE)
    @Column(name="fechaCarga", nullable=false)
    private LocalDate fechaCarga;

    /**
     * estado del documento
     * 
     * Restricciones:
     */
    @Column(name="estado", nullable=false)
    private boolean estado;

    /**
     * formato del documento
     * 
     * Restricciones:
     */
    @Column(name="formato", nullable=false)
    private String formato;

    /**
     * etiqueta del documento(publico o privado)
     * 
     * Restricciones:
     */
    @Column(name="etiqueta", nullable=false)
    private String etiqueta;

    /**
     * ruta del archivo
     *
     * Restricciones:
     */
    @Column(name="archivoDocumento", nullable=false)
    private String archivoDocumento;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "persona")
    private Persona persona;

    /**
     * 
     * Tipo de relación: Many to One
     */
    @ManyToOne
	@JoinColumn(name = "contrato")
    private Contrato contrato;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de Documento con los valores especificados.
     *
     * @param nombre nombre del documento
     * @param descripcion descripcion del documento
     * @param fechaCarga fecha en que se sube el documento al sistema
     * @param estado estado del documento
     * @param formato formato del documento
     * @param etiqueta etiqueta del documento(publico o privado)
     * @param archivoDocumento ruta del archivo
     * @param persona 
     * @param contrato 
     * @param creador Columna que representa el creador de la entidad.
     */
    public Documento(String nombre, String descripcion, LocalDate fechaCarga, boolean estado, String formato, String etiqueta, String archivoDocumento, Persona persona, Contrato contrato, String creador) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaCarga = fechaCarga;
        this.estado = estado;
        this.formato = formato;
        this.etiqueta = etiqueta;
        this.archivoDocumento = archivoDocumento;
        this.persona = persona;
        this.contrato = contrato;
        this.creador = creador;
    }

}
