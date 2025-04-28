/**
 * PeriodicidadPago.java
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
 * Entidad que representa periodicidadpago en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="periodicidadPago")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//@Filter(name = "filtroCreador", condition = "creador = :creador")
public class PeriodicidadPago implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="periodicidadPago_id", nullable=false)
    private long id;

    /**
     * tipo del periodo en que se hace el pago
     * 
     * Restricciones:
     */
    @Column(name="tipoPeriodoPago", nullable=false)
    private String tipoPeriodoPago;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "periodicidadPago", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Contrato> contrato;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de PeriodicidadPago con los valores especificados.
     *
     * @param tipoPeriodoPago tipo del periodo en que se hace el pago
     * @param creador Columna que representa el creador de la entidad.
     */
    public PeriodicidadPago(String tipoPeriodoPago, String creador) {
        this.tipoPeriodoPago = tipoPeriodoPago;
        this.creador = creador;
    }

}
