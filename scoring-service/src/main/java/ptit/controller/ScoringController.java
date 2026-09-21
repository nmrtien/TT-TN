package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.constant.CreditStatus;
import ptit.entity.CreditApplication;
import ptit.entity.CreditTask;
import ptit.entity.Model;
import ptit.service.IScoring;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final IScoring scoringService;


    @PostMapping
    public ResponseEntity<Object> login(@RequestBody CreditApplication application) {
        try {
            CreditTask response = scoringService.createApplication(application);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    @GetMapping("/{status}/applications")
    public ResponseEntity<Object> getApplications(@PathVariable CreditStatus status) {
        try {
            List<CreditApplication> response = scoringService.getApplications(status);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/{id}/tasks")
    public ResponseEntity<Object> detailTask(@PathVariable String id) {
        try {
            CreditTask response = scoringService.getTask(id);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


}
