package Nomina.entity.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.InformeDTO;
import Nomina.entity.entities.Contrato;
import Nomina.entity.entities.CuentaCobro;
import Nomina.entity.entities.Informe;
import Nomina.entity.entities.Proyecto;
import Nomina.entity.repositories.InformeRepository;
import Nomina.entity.services.InformeService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del servicio {@link InformeService} que proporciona
 * la lógica de negocio para gestionar entidades {@link Informe}.
 * <p>Esta implementación se encarga de la gestión completa del ciclo de vida de las entidades,
 * incluyendo operaciones CRUD y métodos de negocio específicos.</p>
 */
@Service
@Transactional
public class InformeServiceImpl implements InformeService {

@Autowired
private HibernateFilterActivator filterActivator;     /** Repositorio para acceder a los datos de la entidad */
    private final InformeRepository repository;

    /**
     * Constructor que inicializa el servicio con su repositorio correspondiente.
     * @param repository Repositorio para la entidad Informe
     */
    @Autowired
    public InformeServiceImpl(InformeRepository repository) {
        this.repository = repository;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Informe> findAll() {
        filterActivator.activarFiltro(Informe.class);
        return repository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<Informe> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Informe save(InformeDTO dto) {
        Informe entity = new Informe();
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
    public Informe update(long id, InformeDTO dto) {
        Optional<Informe> optionalEntity = repository.findById(id);
        if (optionalEntity.isPresent()) {
            Informe entity = optionalEntity.get();
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
        Optional<Informe> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Informe no encontrado con id: " + id);
        }

        Informe entity = optional.get();

        List<String> filePaths = new ArrayList<>();

        if (entity.getInformePDF() != null) {
            String[] contratistaPaths = entity.getInformePDF().split(",");
            for (String path : contratistaPaths) {
                path = path.trim();
                if (!path.isEmpty()) {
                    filePaths.add(path);
                }
            }
        }

        for (String filePathString : filePaths) {
            try {
                Path filePath = Path.of(filePathString).toAbsolutePath().normalize();
                Path uploadsDir = Path.of("uploads").toAbsolutePath().normalize();
                if (filePath.startsWith(uploadsDir)) {
                    Files.deleteIfExists(filePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        repository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Informe> findByCuentaCobro(CuentaCobro cuentaCobro) {
        return repository.findByCuentaCobro(cuentaCobro);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Informe> findByProyecto(Proyecto proyecto) {
        return repository.findByProyecto(proyecto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Informe> findByContrato(Contrato contrato) {
        return repository.findByContrato(contrato);
    }

}
