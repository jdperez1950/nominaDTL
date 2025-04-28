package Nomina.entity.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import Nomina.entity.entities.ConfiguracionEmail;

@Service
public class NotificacionEmailServiceImpl {

    @Autowired
    private ConfiguracionEmailServiceImpl emailConfigService;

    @Value("${EMAIL_FROM}")
    private String emailFrom;

    @Async
    public java.util.concurrent.CompletableFuture<String> sendNotificationEmailAsync(String to, String subject, JsonNode info) {
        ConfiguracionEmail config = emailConfigService.getConfiguration()
                .orElseThrow(() -> new RuntimeException("No se encontró configuración de email"));

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(config.getHost());
        mailSender.setPort(config.getPort());
        mailSender.setUsername(config.getUsername());
        mailSender.setPassword(config.getPassword());

        java.util.Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", config.getAuth() != null ? config.getAuth().toString() : "true");
        props.put("mail.smtp.starttls.enable", config.getStarttlsEnable() != null ? config.getStarttlsEnable().toString() : "true");
        props.put("mail.smtp.ssl.trust", "*");

        StringBuilder body = new StringBuilder();
        info.fields().forEachRemaining(entry -> {
            body.append(entry.getKey())
                .append(": ")
                .append(entry.getValue().asText())
                .append("\n");
        });


        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(config.getUsername());
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body.toString());

        try {
            mailSender.send(message);
            // Si se envía correctamente, retornamos un CompletableFuture completado
            return java.util.concurrent.CompletableFuture.completedFuture("El servicio SMTP está configurado y funcionando correctamente.");
        } catch(Exception e) {
            String errorMsg = e.getMessage();
            if(errorMsg.contains("401") || errorMsg.contains("400")) {
                throw new RuntimeException("Error: Credenciales no válidas para el servicio SMTP. " + errorMsg);
            } else if(errorMsg.contains("500")) {
                throw new RuntimeException("Error: El servicio SMTP está caído. " + errorMsg);
            } else {
                throw new RuntimeException("Error en el servicio SMTP: " + errorMsg);
            }
        }
    }
}
