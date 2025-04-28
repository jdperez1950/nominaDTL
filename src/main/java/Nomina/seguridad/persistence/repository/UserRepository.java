package Nomina.seguridad.persistence.repository;

import Nomina.entity.entities.Persona;
import Nomina.seguridad.dto.AccionObjetoDTO;
import Nomina.seguridad.persistence.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByUsernameAndPassword(String username, String password);
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByPersona(Persona persona);

    @Query(value = "select u from Usuario u")
    List<Usuario> listarTodo();

    @Query(value = """
            (SELECT p.autorizado AS autorizado, 
                    a.nombre AS accion, 
                    obj.nombre_objeto AS objeto,
                    tp.descripcion as tipoObjeto
             FROM privilegio p
             INNER JOIN accion_objeto ao ON p.accion_objeto_id = ao.id
             INNER JOIN accion a ON a.id = ao.accion_id
             INNER JOIN objeto obj ON obj.id = ao.objeto_id
             inner join tipo_objeto tp on tp.id = obj.tipo_objeto_id
             INNER JOIN usuario u ON u.id = p.usuario_id
             WHERE u.username = :username and p.autorizado is true)
             
             UNION
             
             (SELECT p.autorizado AS autorizado, 
                     a.nombre AS accion, 
                     obj.nombre_objeto AS objeto,
                     tp.descripcion as tipoObjeto
              FROM privilegio p
              INNER JOIN accion_objeto ao ON p.accion_objeto_id = ao.id
              INNER JOIN accion a ON a.id = ao.accion_id
              INNER JOIN objeto obj ON obj.id = ao.objeto_id
              inner join tipo_objeto tp on tp.id = obj.tipo_objeto_id
              INNER JOIN rol r ON r.id = p.rol_id
              WHERE r.nombre IN :roleNames and p.autorizado is true)
            """, nativeQuery = true)
    List<Object[]> findPermisosByUsernameAndRoles(
            @Param("username") String username,
            @Param("roleNames") List<String> roleNames
    );


    @Query(value = """
            (SELECT p.autorizado AS autorizado, 
                    a.nombre AS accion, 
                    obj.nombre_objeto AS objeto,
                    tp.descripcion as tipoObjeto
             FROM privilegio p
             INNER JOIN accion_objeto ao ON p.accion_objeto_id = ao.id
             INNER JOIN accion a ON a.id = ao.accion_id
             INNER JOIN objeto obj ON obj.id = ao.objeto_id
             inner join tipo_objeto tp on tp.id = obj.tipo_objeto_id
             INNER JOIN usuario u ON u.id = p.usuario_id
             WHERE u.username = :username 
             and a.nombre = :accion
             and obj.nombre_objeto = :objeto
             and p.autorizado is true)
             
             UNION
             
             (SELECT p.autorizado AS autorizado, 
                     a.nombre AS accion, 
                     obj.nombre_objeto AS objeto,
                     tp.descripcion as tipoObjeto
              FROM privilegio p
              INNER JOIN accion_objeto ao ON p.accion_objeto_id = ao.id
              INNER JOIN accion a ON a.id = ao.accion_id
              INNER JOIN objeto obj ON obj.id = ao.objeto_id
              inner join tipo_objeto tp on tp.id = obj.tipo_objeto_id
              INNER JOIN rol r ON r.id = p.rol_id
              WHERE r.nombre IN :roleNames 
              and a.nombre = :accion
              and obj.nombre_objeto = :objeto
              and p.autorizado is true)
            """, nativeQuery = true)
    List<Object[]> verificarPermiso(
            @Param("username") String username,
            @Param("roleNames") List<String> roleNames,
            @Param("accion") String accion,
            @Param("objeto") String objeto
    );

}