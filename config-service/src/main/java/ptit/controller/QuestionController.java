package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.Question;
import ptit.service.IQuestion;

import java.util.List;

@RestController
@RequestMapping("/api/v1/configs/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final IQuestion questionService;


    // 1. Tạo mới Question
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Question question) {
        try {
            String response = questionService.create(question);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 2. Cập nhật Question
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Question question) {
        try {
            String response = questionService.update(question);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 3. Hiển thị chi tiet Question theo id
    @GetMapping("/{id}")
    public ResponseEntity<Object> detail(@PathVariable String id) {
        try {
            Question response = questionService.detail(id);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    // 4. Hiển thị danh sách Question
    @GetMapping()
    public ResponseEntity<Object> list() {
        try {
            List<Question> response = questionService.list();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
