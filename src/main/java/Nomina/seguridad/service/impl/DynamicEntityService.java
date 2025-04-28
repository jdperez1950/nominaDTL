package Nomina.seguridad.service.impl;
import Nomina.seguridad.persistence.entities.TipoObjeto;
import Nomina.seguridad.persistence.repository.GeneralRepository;
import Nomina.seguridad.persistence.repository.TipoObjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DynamicEntityService {

    @Autowired
    private TipoObjetoRepository tipoObjetoRepository;

    @Autowired
    private GeneralRepository generalRepository;

    public List<?> findByDescripcionAndNombreObjetos(String descripcion, List<String> nombreObjetos) throws Exception {
        // Obtener el className desde la tabla tipo_objeto
        TipoObjeto tipoObjeto = tipoObjetoRepository.findByDescripcion(descripcion)
                .orElseThrow(() -> new IllegalArgumentException("Tipo de objeto no encontrado"));

        String className = tipoObjeto.getClaseName();

        // Hacer la consulta dinámica
        return generalRepository.findByNombreObjetos(className, nombreObjetos);
    }
}
