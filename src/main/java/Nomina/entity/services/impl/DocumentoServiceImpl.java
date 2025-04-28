package Nomina.entity.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import Nomina.entity.dto.DocumentoDTO;
import Nomina.entity.entities.*;
import Nomina.entity.repositories.DocumentoRepository;
import Nomina.entity.services.DocumentoService;
import Nomina.seguridad.Interceptor.HibernateFilterActivator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.Doc;

/**
 * Implementación del servicio {@link DocumentoService} que proporciona
 * la lógica de negocio para gestionar entidades {@link Documento}.
 * <p>Esta implementación se encarga de la gestión completa del ciclo de vida de las entidades,
 * incluyendo operaciones CRUD y métodos de negocio específicos.</p>
 */
@Service
@Transactional
public class DocumentoServiceImpl implements DocumentoService {

@Autowired
private HibernateFilterActivator filterActivator;     /** Repositorio para acceder a los datos de la entidad */
    private final DocumentoRepository repository;

    /**
     * Constructor que inicializa el servicio con su repositorio correspondiente.
     * @param repository Repositorio para la entidad Documento
     */
    @Autowired
    public DocumentoServiceImpl(DocumentoRepository repository) {
        this.repository = repository;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Documento> findAll() {
        filterActivator.activarFiltro(Documento.class);
        return repository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<Documento> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Documento save(DocumentoDTO dto) {
        Documento entity = new Documento();
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
    public Documento update(long id, DocumentoDTO dto) {
        Optional<Documento> optionalEntity = repository.findById(id);
        if (optionalEntity.isPresent()) {
            Documento entity = optionalEntity.get();
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
        Optional<Documento> optional = repository.findById(id);
        if (optional.isEmpty()) {
            throw new RuntimeException("Documento no encontrado con id: " + id);
        }

        Documento entity = optional.get();

        List<String> filePaths = new ArrayList<>();

        if (entity.getArchivoDocumento() != null) {
            String[] contratistaPaths = entity.getArchivoDocumento().split(",");
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
    public List<Documento> findByPersona(Persona persona) {
        return repository.findByPersona(persona);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Documento> findByContrato(Contrato contrato) {
        return repository.findByContrato(contrato);
    }

}
