package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.Model;
import ptit.service.IModel;

import java.util.List;

@RestController
@RequestMapping("/api/v1/configs")
@RequiredArgsConstructor
public class ModelController {

    private final IModel modelService;


    // 1. Tạo mới Model
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Model model) {
        try {
            String response = modelService.create(model);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 2. Cập nhật Model
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody Model model) {
        try {
            String response = modelService.update(model);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 3. Hiển thị chi tiet Model theo id
    @GetMapping("/{id}")
    public ResponseEntity<Object> detail(@PathVariable String id) {
        try {
            Model response = modelService.detail(id);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    // 4. Hiển thị danh sách Model
    @GetMapping()
    public ResponseEntity<Object> list() {
        try {
            List<Model> response = modelService.list();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
