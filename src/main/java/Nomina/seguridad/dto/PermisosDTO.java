package Nomina.seguridad.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class PermisosDTO {
    private String token;
    private ArrayList<AccionObjetoDTO> permisos;
}
