package Nomina.entity.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import lombok.*;
import Nomina.entity.entities.*;

/**
 * DTO (Data Transfer Object) para la entidad Persona.
 * Esta clase se utiliza para transferir datos de Persona entre diferentes capas de la aplicación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PersonaDTO {

    /**
     * Campo que representa nombre
     */
    private String nombre;

    /**
     * Campo que representa correo
     */
    private String correo;

    /**
     * Campo que representa numeroDocumento
     */
    private String numeroDocumento;

    /**
     * Campo que representa tituloProfesional
     */
    private String tituloProfesional;

    /**
     * Campo que representa direccion
     */
    private String direccion;

    /**
     * Campo que representa telefono
     */
    private String telefono;

    /**
     * Campo que representa fechaExpedicion
     */
    private LocalDate fechaExpedicion;

    /**
     * Campo que representa fechaNacimiento
     */
    private LocalDate fechaNacimiento;

    /**
     * Campo que representa nacionalidad
     */
    private String nacionalidad;

    /**
     * Campo que representa documentosFormacionAcademica
     */
    private String documentosFormacionAcademica;


    /**
     * Campo que representa documentosLegales
     */
    private String documentosLegales;


    /**
     * Campo que representa certificacionesLaborales
     */
    private String certificacionesLaborales;


    /**
     * Representa la relación  con la entidad proyecto
     * Este campo representa una colección de elementos.
     */
    private List<Proyecto> proyecto;

    /**
     * Representa la relación  con la entidad contrato
     * Este campo representa una colección de elementos.
     */
    private List<Contrato> contrato;

    /**
     * Representa la relación  con la entidad documento
     * Este campo representa una colección de elementos.
     */
    private List<Documento> documento;

    /**
     * Representa la relación  con la entidad tipoDocumento
     */
    private TipoDocumento tipoDocumento;

    /**
     * Campo que representa el creador del registro.
     */
    private String creador;

    /**
     * Campo que indica si la persona necesita acceso al sistema
     */
    private boolean necesitaAcceso;

    /**
     * Lista de IDs de roles asignados si la persona necesita acceso al sistema.
     */
    private Set<Long> roles;

    private String tipoPersona;

    // Campos específicos de cada tipo de persona
    private String experienciaProfesional; // Para Gerente y Contratista
    private String numeroTarjetaProfesional; // Para Contratista y Contador
    private String telefonoAdicional; // Solo para Contratista

}
