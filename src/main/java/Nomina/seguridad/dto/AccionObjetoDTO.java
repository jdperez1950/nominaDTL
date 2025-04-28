package Nomina.seguridad.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccionObjetoDTO {
    private boolean autorizado;
    private String accion;
    private String objeto;
    private String tipoObjeto;
    private Long idPrivilegio;

    public AccionObjetoDTO(Boolean autorizado, String accion, String objeto, String tipoObjeto) {
        this.autorizado = autorizado;
        this.accion = accion;
        this.objeto = objeto;
        this.tipoObjeto = tipoObjeto;
    }

    public AccionObjetoDTO(Boolean autorizado, String accion, String objeto, String tipoObjeto, Long idPrivilegio) {
        this.autorizado = autorizado;
        this.accion = accion;
        this.objeto = objeto;
        this.tipoObjeto = tipoObjeto;
        this.idPrivilegio = idPrivilegio;
    }

    public AccionObjetoDTO() {
    }
}
