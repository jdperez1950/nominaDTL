package Nomina.entity.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad Contrato.
 * Esta clase se utiliza para transferir datos de Contrato entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContratoDTO {

    /**
     * Campo que representa numeroContrato
     */
    private String numeroContrato;

    /**
     * Campo que representa cargo
     */
    private String cargo;

    /**
     * Campo que representa valorTotalContrato
     */
    private long valorTotalContrato;

    /**
     * Campo que representa numeroPagos
     */
    private int numeroPagos;

    /**
     * Campo que representa fechaInicioContrato
     */
    private LocalDate fechaInicioContrato;

    /**
     * Campo que representa fechaFinContrato
     */
    private LocalDate fechaFinContrato;

    /**
     * Campo que representa estado
     */
    private boolean estado;

    /**
     * Campo que representa contratoPdf
     */
    private String contratoPdf;

    /**
     * Campo que representa firmado
     */
    private boolean firmado;

    /**
     * Representa la relación  con la entidad proyecto
     */
    private Proyecto proyecto;

    /**
     * Representa la relación  con la entidad persona
     */
    private Persona persona;

    /**
     * Representa la relación  con la entidad documento
     * Este campo representa una colección de elementos.
     */
    private List<Documento> documento;

    /**
     * Representa la relación  con la entidad cuentaCobro
     * Este campo representa una colección de elementos.
     */
    private List<CuentaCobro> cuentaCobro;

    /**
     * Representa la relación  con la entidad tipoContrato
     */
    private TipoContrato tipoContrato;

    /**
     * Representa la relación  con la entidad periodicidadPago
     */
    private PeriodicidadPago periodicidadPago;

    /**
     * Representa la relación  con la entidad informe
     * Este campo representa una colección de elementos.
     */
    private List<Informe> informe;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;

    /**
     * Campo que representa las observaciones del contrato
     */
    private String observaciones;

    /**
     * Campo que representa los archivos adicionales del contrato
     */
    private String archivosAdicionales;

}
