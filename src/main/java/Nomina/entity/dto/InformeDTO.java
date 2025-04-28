package Nomina.entity.dto;

import java.time.LocalDate;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad Informe.
 * Esta clase se utiliza para transferir datos de Informe entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InformeDTO {

    /**
     * Campo que representa fecha
     */
    private LocalDate fecha;

    /**
     * Campo que representa cliente
     */
    private String cliente;

    /**
     * Campo que representa cargo
     */
    private String cargo;

    /**
     * Campo que representa informePDF
     */
    private String informePDF;

    /**
     * Representa la relación  con la entidad cuentaCobro
     */
    private CuentaCobro cuentaCobro;

    /**
     * Representa la relación  con la entidad proyecto
     */
    private Proyecto proyecto;

    /**
     * Representa la relación  con la entidad contrato
     */
    private Contrato contrato;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;
}
