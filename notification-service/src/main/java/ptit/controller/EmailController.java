package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.Email;
import ptit.service.IEmail;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class EmailController {

    private final IEmail emailService;


    // 1. Send email
    @PostMapping
    public ResponseEntity<Object> createSalary(@RequestBody Email email) {
        try {
            emailService.sendEmail(email);
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

}
