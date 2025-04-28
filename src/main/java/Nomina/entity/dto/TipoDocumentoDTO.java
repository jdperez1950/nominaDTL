package Nomina.entity.dto;

import java.util.List;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad TipoDocumento.
 * Esta clase se utiliza para transferir datos de TipoDocumento entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoDocumentoDTO {

    /**
     * Campo que representa nombreTipoDocumento
     */
    private String nombreTipoDocumento;

    /**
     * Representa la relación  con la entidad persona
     * Este campo representa una colección de elementos.
     */
    private List<Persona> persona;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;

}
