package Nomina.seguridad.persistence.repository;

import Nomina.seguridad.persistence.entities.Privilegio;
import Nomina.seguridad.persistence.entities.Rol;
import Nomina.seguridad.persistence.entities.AccionObjeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrivilegioRepository extends JpaRepository<Privilegio, Long> {

    @Query(value = """
            SELECT distinct p.autorizado AS autorizado,\s
                                 a.nombre AS accion,\s
                                 obj.nombre_objeto AS objeto,
                                 tp.descripcion as tipoObjeto,
                                 p.id as idPrivilegio
                          FROM privilegio p
                          INNER JOIN accion_objeto ao ON p.accion_objeto_id = ao.id
                          INNER JOIN accion a ON a.id = ao.accion_id
                          INNER JOIN objeto obj ON obj.id = ao.objeto_id
                          inner join tipo_objeto tp on tp.id = obj.tipo_objeto_id
                          WHERE p.rol_id = :id_rol  or p.usuario_id = :id_user
            """, nativeQuery = true)
    List<Object[]> findPermisosByUsernameORol(
            @Param("id_rol") Long id_rol,
            @Param("id_user") Long id_user
    );

    @Transactional
    @Modifying
    @Query("DELETE FROM Privilegio p WHERE p.rol.id = :rolId")
    void deleteByRolId(@Param("rolId") Long rolId);

    Optional<Privilegio> findByRolAndAccionObjeto(Rol rol, AccionObjeto accionObjeto);
}
