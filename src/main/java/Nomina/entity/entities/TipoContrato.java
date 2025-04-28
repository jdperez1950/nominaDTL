/**
 * TipoContrato.java
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
 * Entidad que representa tipocontrato en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="tipoContrato")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//@Filter(name = "filtroCreador", condition = "creador = :creador")
public class TipoContrato implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tipoContrato_id", nullable=false)
    private long id;

    /**
     * nombre del tipo de contrato
     * 
     * Restricciones:
     */
    @Column(name="nombreTipoContrato", nullable=false)
    private String nombreTipoContrato;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "tipoContrato", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Contrato> contrato;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de TipoContrato con los valores especificados.
     *
     * @param nombreTipoContrato nombre del tipo de contrato
     * @param creador Columna que representa el creador de la entidad.
     */
    public TipoContrato(String nombreTipoContrato, String creador) {
        this.nombreTipoContrato = nombreTipoContrato;
        this.creador = creador;
    }

}
