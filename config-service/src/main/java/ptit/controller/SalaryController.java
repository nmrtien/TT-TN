package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.Salary;
import ptit.service.ISalary;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final ISalary salaryService;

    // 1. Tạo mới Salary
    @PostMapping
    public ResponseEntity<Object> createSalary(@RequestBody Salary salary) {

        try {
            String response = salaryService.createSalary(salary);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 2. Cập nhật Salary
    @PutMapping
    public ResponseEntity<Object> updateSalary(@RequestBody Salary salary) {

        try {
            String response = salaryService.updateSalary(salary);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }

    // 3. Hiển thị danh sách salary theo mã nhân viên
    @GetMapping("/{maNV}")
    public ResponseEntity<Object> getNhanVienByPhongBan(@PathVariable String maNV) {

        try {
            List<Salary> response = salaryService.reportSalary(maNV);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
