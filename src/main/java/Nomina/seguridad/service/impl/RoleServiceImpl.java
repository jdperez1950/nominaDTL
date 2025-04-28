package Nomina.seguridad.service.impl;

import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.dto.RolDTO;
import Nomina.seguridad.dto.SaveRolRol;
import Nomina.seguridad.exception.ObjectNotFoundException;
import Nomina.seguridad.persistence.entities.AccionObjeto;
import Nomina.seguridad.persistence.entities.Privilegio;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.Usuario;
import Nomina.seguridad.persistence.repository.AccionObjetoRepository;
import Nomina.seguridad.persistence.repository.PrivilegioRepository;
import Nomina.seguridad.persistence.repository.RoleRepository;
import Nomina.seguridad.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AccionObjetoRepository accionObjetoRepository;

    @Autowired
    @Lazy
    private RoleService roleService;
    @Override
    public Optional<Rol> findDefaultRole() {
        return roleRepository.findByNombre("CLIENTE");
    }

    @Autowired
    private PrivilegioRepository privilegioRepository;

    @Override
    public Optional<Rol> findByNombre(String name) {
        return roleRepository.findByNombre(name);
    }

    @Override
    @Transactional
    public Rol crearRol(Rol rol) {
        // Verificar si el rol ya existe
        Optional<Rol> existingRole = roleRepository.findByNombre(rol.getNombre());
        if (existingRole.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol ya está registrado.");
        }

        // Guardar el nuevo rol
        Rol rolGuardado = roleRepository.save(rol);

        // Obtener todas las entradas de accion_objeto
        List<AccionObjeto> accionesObjetos = accionObjetoRepository.findAll();

        // Crear las entradas de privilegio para el nuevo rol
        List<Privilegio> privilegios = accionesObjetos.stream().map(accionObjeto -> {
            Privilegio privilegio = new Privilegio();
            privilegio.setAutorizado(false);
            privilegio.setAccionObjeto(accionObjeto);
            privilegio.setRol(rolGuardado);
            return privilegio;
        }).collect(Collectors.toList());

        // Guardar todos los privilegios en la base de datos
        privilegioRepository.saveAll(privilegios);

        return rolGuardado;
    }


    // @Override
    /*public List<Rol> getRoles() {
        return roleRepository.findAll();
    }*/

    @Override
    public List<RolDTO> getRoles() {
        List<Rol> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private RolDTO convertToDto(Rol rol) {
        RolDTO dto = new RolDTO();
        dto.setId(rol.getId());
        dto.setNombre(rol.getNombre());
        dto.setRolesHijos(rol.getRolesHijos().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList()));
        return dto;
    }


    @Override
    public Boolean agregarRol(SaveRolRol saveRolRol) {
        // Buscar el rol principal (rol padre)
        Rol rolPadre = roleRepository.findByNombre(saveRolRol.getRol())
                .orElseThrow(() -> new ObjectNotFoundException("Rol no encontrado: " + saveRolRol.getRol()));

        // Verificar si se proporcionaron roles hijos
        if (saveRolRol.getRolesHijos() != null && !saveRolRol.getRolesHijos().isEmpty()) {
            // Buscar y agregar cada rol hijo
            Set<Rol> rolesHijos = saveRolRol.getRolesHijos().stream()
                    .map(nombreHijo -> roleRepository.findByNombre(nombreHijo)
                            .orElseThrow(() -> new ObjectNotFoundException("Rol hijo no encontrado: " + nombreHijo)))
                    .collect(Collectors.toSet());

            // Asignar los roles hijos al rol padre
            rolPadre.getRolesHijos().addAll(rolesHijos);

            // Para cada rol hijo, copiar sus permisos al rol padre
            for (Rol rolHijo : rolesHijos) {
                // Obtener los permisos del rol hijo
                List<AccionObjetoDTO> permisosHijo = getPermisosPorRolOUsuario(rolHijo.getId(), -1L);
                
                // Para cada permiso del rol hijo, crear o actualizar el permiso en el rol padre
                for (AccionObjetoDTO permisoHijo : permisosHijo) {
                    // Buscar el AccionObjeto correspondiente usando la acción y el objeto
                    AccionObjeto accionObjeto = accionObjetoRepository.findByAccionNombreAndObjetoNombreObjeto(
                        permisoHijo.getAccion(), 
                        permisoHijo.getObjeto()
                    ).orElseThrow(() -> new ObjectNotFoundException("Acción-Objeto no encontrada"));

                    // Buscar si ya existe un privilegio para esta acción-objeto en el rol padre
                    Optional<Privilegio> privilegioExistente = privilegioRepository.findByRolAndAccionObjeto(rolPadre, accionObjeto);
                    
                    if (privilegioExistente.isPresent()) {
                        // Si existe, actualizar el estado de autorización
                        Privilegio privilegio = privilegioExistente.get();
                        privilegio.setAutorizado(privilegio.getAutorizado() || permisoHijo.isAutorizado());
                        privilegioRepository.save(privilegio);
                    } else {
                        // Si no existe, crear uno nuevo
                        Privilegio nuevoPrivilegio = new Privilegio();
                        nuevoPrivilegio.setRol(rolPadre);
                        nuevoPrivilegio.setAccionObjeto(accionObjeto);
                        nuevoPrivilegio.setAutorizado(permisoHijo.isAutorizado());
                        privilegioRepository.save(nuevoPrivilegio);
                    }
                }
            }
        }

        // Guardar el rol padre con sus hijos
        roleRepository.save(rolPadre);

        return true;
    }

    public List<AccionObjetoDTO> getPermisosPorRolOUsuario(Long rolId, Long userId) throws ObjectNotFoundException {

        // Buscar permisos basados en el username y la lista de roles
        List<Object[]> resultados = privilegioRepository.findPermisosByUsernameORol(
                rolId, userId
        );

        List<AccionObjetoDTO> permisos = resultados.stream()
                .map(r -> new AccionObjetoDTO((Boolean) r[0], (String) r[1], (String) r[2], (String) r[3], (Long) r[4]))
                .toList();

        return permisos;
    }

    @Override
    public Optional<Rol> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public boolean quitarRolHijo(Long rolPadreId, Long rolHijoId) {
        // Buscar el rol padre
        Rol rolPadre = roleRepository.findById(rolPadreId)
                .orElseThrow(() -> new ObjectNotFoundException("Rol padre no encontrado con ID: " + rolPadreId));

        // Buscar el rol hijo
        Rol rolHijo = roleRepository.findById(rolHijoId)
                .orElseThrow(() -> new ObjectNotFoundException("Rol hijo no encontrado con ID: " + rolHijoId));

        // Quitar el rol hijo del rol padre
        boolean removed = rolPadre.getRolesHijos().remove(rolHijo);

        if (removed) {
            roleRepository.save(rolPadre); // Guardar los cambios
            return true;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El rol hijo no estaba asociado al rol padre");
        }
    }

    @Override
    public boolean eliminarRolPadre(Long rolPadreId) {
        Rol rol = roleRepository.findById(rolPadreId)
                .orElseThrow(() -> new ObjectNotFoundException("Rol padre no encontrado"));

        // Eliminar privilegios relacionados antes de eliminar el rol
        privilegioRepository.deleteByRolId(rolPadreId);

        // Ahora elimina el rol
        roleRepository.delete(rol);
        return true;
    }

}


