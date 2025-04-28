package Nomina.entity.dto;

import java.time.LocalDate;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad Documento.
 * Esta clase se utiliza para transferir datos de Documento entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentoDTO {

    /**
     * Campo que representa nombre
     */
    private String nombre;

    /**
     * Campo que representa descripcion
     */
    private String descripcion;

    /**
     * Campo que representa fechaCarga
     */
    private LocalDate fechaCarga;

    /**
     * Campo que representa estado
     */
    private boolean estado;

    /**
     * Campo que representa formato
     */
    private String formato;

    /**
     * Campo que representa etiqueta
     */
    private String etiqueta;

    /**
     * Campo que representa archivoDocumento
     */
    private String archivoDocumento;

    /**
     * Representa la relación  con la entidad persona
     */
    private Persona persona;

    /**
     * Representa la relación  con la entidad contrato
     */
    private Contrato contrato;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;

}
