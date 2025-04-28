package Nomina.seguridad.persistence.repository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Repository
public class GeneralRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<?> findByNombreObjetos(String className, List<String> nombreObjetos) throws ClassNotFoundException {
        Class<?> entityClass = Class.forName(className);

        String query = "SELECT e FROM " + entityClass.getSimpleName() + " e WHERE e.nombreObjeto IN :nombreObjetos ORDER BY e.id ASC";
        return entityManager.createQuery(query, entityClass)
                .setParameter("nombreObjetos", nombreObjetos)
                .getResultList();
    }
}
