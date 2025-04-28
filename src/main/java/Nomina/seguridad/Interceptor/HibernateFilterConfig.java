package Nomina.seguridad.Interceptor;
import jakarta.persistence.MappedSuperclass;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;


@MappedSuperclass
@FilterDef(name = "filtroCreador", parameters = @ParamDef(name = "creador", type = String.class))
public class HibernateFilterConfig {

}
