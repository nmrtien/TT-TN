package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.PhongBan;
import ptit.service.IPhongBan;

import java.util.List;

@RestController
@RequestMapping("/api/v1/phongban")
@RequiredArgsConstructor
public class PhongBanController {

    private final IPhongBan phongBanService;

    // 1. Tạo mới phòng ban
    @PostMapping
    public ResponseEntity<Object> createPhongBan(@RequestBody PhongBan pb) {

        try {
            String response = phongBanService.createPhongBan(pb);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 2. Cập nhật phòng ban
    @PutMapping
    public ResponseEntity<Object> updatePhongBan(@RequestBody PhongBan pb) {

        try {
            String response = phongBanService.updatePhongBan(pb);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 3. Hiển thị danh sách phòng ban
    @GetMapping
    public ResponseEntity<Object> getAllPhongBan() {

        try {
            List<PhongBan> list = phongBanService.getAllPhongBan();
            return ResponseEntity.ok().body(list);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 4. Xóa phòng ban (chỉ khi không có nhân viên)
    @DeleteMapping("/{maPB}")
    public ResponseEntity<String> deletePhongBan(@PathVariable String maPB) {

        try {
            String response = phongBanService.deletePhongBan(maPB);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
