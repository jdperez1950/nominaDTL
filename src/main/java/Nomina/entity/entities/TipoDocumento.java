/**
 * TipoDocumento.java
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
 * Entidad que representa tipodocumento en el sistema.
 * Esta clase es una entidad JPA que se mapea a la tabla correspondiente en la base de datos.
 *
 * @author EntityWriter
 * @version 1.0
 */
@Table(name="tipoDocumento")
@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
//@Filter(name = "filtroCreador", condition = "creador = :creador")
public class TipoDocumento implements Serializable {

    /**
     * Identificador unico de la entidad. Este campo representa la clave primaria de la tabla en la base de datos.
     * 
     * Restricciones:
     */
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tipoDocumento_id", nullable=false)
    private long id;

    /**
     * nombre del tipo de documento
     * 
     * Restricciones:
     */
    @Column(name="nombreTipoDocumento", nullable=false)
    private String nombreTipoDocumento;

    /**
     * Columna que representa el creador de la entidad.
     */
    @Column(name = "creador")
    private String creador;

    /**
     * 
     * Tipo de relación: One to Many
     */
    @OneToMany(mappedBy = "tipoDocumento", fetch = FetchType.EAGER)
	@JsonIgnore
    private List<Persona> persona;

    /**
     * Constructor con parámetros.
     * Inicializa una nueva instancia de TipoDocumento con los valores especificados.
     *
     * @param nombreTipoDocumento nombre del tipo de documento
     * @param creador Columna que representa el creador de la entidad.
     */
    public TipoDocumento(String nombreTipoDocumento, String creador) {
        this.nombreTipoDocumento = nombreTipoDocumento;
        this.creador = creador;
    }

}
