package Nomina.seguridad.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;
import java.util.Set;

public class SaveRolRol implements Serializable {

    @NotBlank
    private String rol; // Nombre del rol principal

    private Set<String> rolesHijos; // Conjunto de nombres de roles hijos (puede ser opcional)

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Set<String> getRolesHijos() {
        return rolesHijos;
    }

    public void setRolesHijos(Set<String> rolesHijos) {
        this.rolesHijos = rolesHijos;
    }
}
