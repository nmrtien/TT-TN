package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.CreditApplication;
import ptit.entity.Model;
import ptit.service.IScoring;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scoring")
@RequiredArgsConstructor
public class ScoringController {

    private final IScoring scoringService;


    // 3. Hiển thị danh sách phòng ban
    @GetMapping
    public ResponseEntity<Object> getAllPhongBan(@RequestParam Integer level) {

        try {
            List<Model> list = scoringService.getModels(level);
            return ResponseEntity.ok().body(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


}
