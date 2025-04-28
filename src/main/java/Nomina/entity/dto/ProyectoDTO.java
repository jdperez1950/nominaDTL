package Nomina.entity.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad Proyecto.
 * Esta clase se utiliza para transferir datos de Proyecto entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProyectoDTO {

    /**
     * Campo que representa nombre
     */
    private String nombre;

    /**
     * Campo que representa valorContrato
     */
    private long valorContrato;

    /**
     * Campo que representa tiempoContractual
     */
    private String tiempoContractual;

    /**
     * Campo que representa objetoContractual
     */
    private String objetoContractual;

    /**
     * Campo que representa alcanceContractual
     */
    private String alcanceContractual;

    /**
     * Campo que representa estado
     */
    private boolean estado;

    /**
     * Campo que representa numeroContrato
     */
    private String numeroContrato;

    /**
     * Campo que representa cliente
     */
    private String cliente;

    /**
     * Campo que representa fechaInicio
     */
    private LocalDate fechaInicio;

    /**
     * Campo que representa fechaFin
     */
    private LocalDate fechaFin;

    /**
     * Representa la relación  con la entidad persona
     * Este campo representa una colección de elementos.
     */
    private List<Persona> persona;

    /**
     * Representa la relación  con la entidad contrato
     * Este campo representa una colección de elementos.
     */
    private List<Contrato> contrato;

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
     * Campo que representa el supervisor del proyecto
     */
    private String supervisor;

    /**
     * Campo que representa el contacto del supervisor del proyecto
     */
    private String contactoSupervisor;

    /**
     * Campo que representa las observaciones del proyecto
     */
    private String observaciones;

    /**
     * Campo que representa los archivos adicionales del proyecto
     */
    private String archivosAdicionales;

}
