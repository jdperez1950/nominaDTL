package Nomina.seguridad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class SaveUsuarioRol implements Serializable {

    @NotNull
    @NotEmpty
    private List<String> roles;
    @NotBlank
    private String username;

}
