package Nomina.seguridad.Interceptor;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SecurityContextPersonalizado {
    private String usuarioActual = "ANONYMOUS";
    private boolean tieneRolNoAdministrador = false;
    private boolean esContador = false;
    private boolean esAdminGerente = false;
    private List<String> roles = new ArrayList<>(); //Guardar lista de roles del usuario

    public String getUsuarioActual() {
        return usuarioActual;
    }

    public void setUsuarioActual(String usuarioActual) {
        this.usuarioActual = usuarioActual;
    }

    public boolean isTieneRolNoAdministrador() {
        return tieneRolNoAdministrador;
    }

    public void setTieneRolNoAdministrador(boolean tieneRolNoAdministrador) {
        this.tieneRolNoAdministrador = tieneRolNoAdministrador;
    }

    public boolean isEsContador() {
        return esContador;
    }

    public void setEsContador(boolean esContador) {
        this.esContador = esContador;
    }

    public boolean isEsAdminGerente() {
        return esAdminGerente;
    }

    public void setEsAdminGerente(boolean esAdminGerente) {
        this.esAdminGerente = esAdminGerente;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public void limpiar() {
        this.usuarioActual = "ANONYMOUS";
        this.tieneRolNoAdministrador = false;
        this.esContador = false;
        this.esAdminGerente = false;
        this.roles.clear();
    }
}
