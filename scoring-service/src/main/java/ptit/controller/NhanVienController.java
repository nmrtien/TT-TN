package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.NhanVien;
import ptit.service.INhanVien;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nhanvien")
@RequiredArgsConstructor
public class NhanVienController {

    private final INhanVien nhanVienService;

    // 1. Tạo mới phòng ban
    @PostMapping
    public ResponseEntity<Object> createNhanVien(@RequestBody NhanVien nv) {

        try {
            String response = nhanVienService.createNhanVien(nv);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 2. Cập nhật phòng ban
    @PutMapping
    public ResponseEntity<Object> updateNhanVien(@RequestBody NhanVien nv) {

        try {
            String response = nhanVienService.updateNhanVien(nv);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 3. Hiển thị danh sách nhân viên theo mã phòng ban
    @GetMapping("/{maPB}")
    public ResponseEntity<Object> getNhanVienByPhongBan(@PathVariable String maPB) {

        try {
            List<NhanVien> response = nhanVienService.getNhanVienByPhongBan(maPB);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 4. Xóa nhân viên theo mã NV
    @DeleteMapping("/{maNV}")
    public ResponseEntity<String> deleteNhanVien(@PathVariable String maNV) {

        try {
            String response = nhanVienService.deleteNhanVien(maNV);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
