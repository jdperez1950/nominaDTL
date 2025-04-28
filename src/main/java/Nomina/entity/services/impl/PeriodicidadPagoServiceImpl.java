package Nomina.entity.services.impl;

import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.PeriodicidadPagoDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.PeriodicidadPago;
import Nomina.entity.repositories.PeriodicidadPagoRepository;
import Nomina.entity.services.PeriodicidadPagoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del servicio {@link PeriodicidadPagoService} que proporciona
 * la lógica de negocio para gestionar entidades {@link PeriodicidadPago}.
 * <p>Esta implementación se encarga de la gestión completa del ciclo de vida de las entidades,
 * incluyendo operaciones CRUD y métodos de negocio específicos.</p>
 */
@Service
@Transactional
public class PeriodicidadPagoServiceImpl implements PeriodicidadPagoService {

@Autowired
private HibernateFilterActivator filterActivator;     /** Repositorio para acceder a los datos de la entidad */
    private final PeriodicidadPagoRepository repository;

    /**
     * Constructor que inicializa el servicio con su repositorio correspondiente.
     * @param repository Repositorio para la entidad PeriodicidadPago
     */
    @Autowired
    public PeriodicidadPagoServiceImpl(PeriodicidadPagoRepository repository) {
        this.repository = repository;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<PeriodicidadPago> findAll() {
        filterActivator.activarFiltro(PeriodicidadPago.class);
        return repository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<PeriodicidadPago> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public PeriodicidadPago save(PeriodicidadPagoDTO dto) {
        PeriodicidadPago entity = new PeriodicidadPago();
        for (java.lang.reflect.Field field : dto.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                java.lang.reflect.Field entityField = entity.getClass().getDeclaredField(field.getName());
                entityField.setAccessible(true);
                entityField.set(entity, field.get(dto));
            } catch (NoSuchFieldException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return repository.save(entity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public PeriodicidadPago update(long id, PeriodicidadPagoDTO dto) {
        Optional<PeriodicidadPago> optionalEntity = repository.findById(id);
        if (optionalEntity.isPresent()) {
            PeriodicidadPago entity = optionalEntity.get();
            for (java.lang.reflect.Field field : dto.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    java.lang.reflect.Field entityField = entity.getClass().getDeclaredField(field.getName());
                    entityField.setAccessible(true);
                    entityField.set(entity, field.get(dto));
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
            return repository.save(entity);
        } else {
            throw new RuntimeException("Entity not found");
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<PeriodicidadPago> findByContrato(Contrato contrato) {
        return repository.findByContrato(contrato);
    }

}
