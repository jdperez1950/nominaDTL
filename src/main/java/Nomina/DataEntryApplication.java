package Nomina;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EntityScan(basePackages = "Nomina.entity.entities")
public class DataEntryApplication {
    public static void main(String[] args) {
        SpringApplication.run(DataEntryApplication.class, args);
        try {
            System.out.println("El servicio del backend esta funcionando en el puerto 8080");
        } catch (Exception e) {
            System.err.println("Error en el proceso: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
