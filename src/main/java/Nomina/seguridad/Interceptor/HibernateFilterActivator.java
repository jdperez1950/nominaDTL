package Nomina.seguridad.Interceptor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.hibernate.annotations.Filter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class HibernateFilterActivator {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private SecurityContextPersonalizado securityContextPersonalizado;

    @Transactional
    public void activarFiltro(Class<?> entidad) {
        if (securityContextPersonalizado.isTieneRolNoAdministrador() && tieneFiltroCreador(entidad)) {
            Session session = entityManager.unwrap(Session.class);
            session.enableFilter("filtroCreador")
                    .setParameter("creador", securityContextPersonalizado.getUsuarioActual());
        }
    }

    private boolean tieneFiltroCreador(Class<?> entidad) {
        return entidad.isAnnotationPresent(Filter.class); // Solo activa si la entidad tiene @Filter
    }
}