package Nomina.entity.dto;

import java.util.List;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad TipoContrato.
 * Esta clase se utiliza para transferir datos de TipoContrato entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TipoContratoDTO {

    /**
     * Campo que representa nombreTipoContrato
     */
    private String nombreTipoContrato;

    /**
     * Representa la relación  con la entidad contrato
     * Este campo representa una colección de elementos.
     */
    private List<Contrato> contrato;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;

}
