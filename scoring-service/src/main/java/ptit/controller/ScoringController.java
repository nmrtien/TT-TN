package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.*;
import ptit.service.IScoring;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final IScoring scoringService;


    @PostMapping
    public ResponseEntity<Object> createApplication(@RequestBody CreditApplication application) {
        try {
            CreditTask response = scoringService.createApplication(application);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    @PostMapping("/tasks/claim")
    public ResponseEntity<Object> claimTask(@RequestBody ClaimTask claimTask) {
        try {
            CreditTask response = scoringService.claimTask(claimTask);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    @PostMapping("/applications/search")
    public ResponseEntity<Object> getApplications(@RequestBody ApplicationRequest request) {
        try {
            List<CreditApplication> response = scoringService.getApplications(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    @PostMapping("/tasks/detail")
    public ResponseEntity<Object> detailTask(@RequestBody ApplicationRequest request) {
        try {
            CreditTask response = scoringService.detailTask(request);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    @PostMapping("/tasks/complete")
    public ResponseEntity<Object> completeTask(@RequestBody CreditTask creditTask) {
        try {
            CreditTask response = scoringService.completeTask(creditTask);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
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


    @GetMapping("/applications")
    public ResponseEntity<Object> getApplications() {
        try {
            List<CreditApplication> response = scoringService.getAllApplication();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/tasks")
    public ResponseEntity<Object> getAllTasks() {
        try {
            List<CreditTask> response = scoringService.getAllTasks();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    @GetMapping("/{roleGroup}/models")
    public ResponseEntity<Object> models(@PathVariable String roleGroup) {
        try {
            List<Model> response = scoringService.getModels(roleGroup);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
