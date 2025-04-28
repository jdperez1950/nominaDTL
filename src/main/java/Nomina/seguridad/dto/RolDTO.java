package Nomina.seguridad.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RolDTO {

    private Long id;
    private String nombre;
    private List<RolDTO> rolesHijos;
}
