package ptit.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptit.entity.SystemUser;
import ptit.service.ISystemUserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final ISystemUserService systemUserService;


    // 1. Tạo mới SystemUser
    @PostMapping
    public ResponseEntity<Object> create(@RequestBody SystemUser systemUser) {
        try {
            String response = systemUserService.create(systemUser);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 2. Cập nhật SystemUser
    @PutMapping
    public ResponseEntity<Object> update(@RequestBody SystemUser systemUser) {
        try {
            String response = systemUserService.update(systemUser);
            if (response.contains("KHÔNG THÀNH CÔNG"))
                return ResponseEntity.badRequest().body(response);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage());
        }
    }


    // 3. Hiển thị chi tiet SystemUser theo id
    @GetMapping("/{id}")
    public ResponseEntity<Object> detail(@PathVariable String id) {
        try {
            SystemUser response = systemUserService.detail(id);
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    // 4. Hiển thị danh sách SystemUser
    @GetMapping()
    public ResponseEntity<Object> list() {
        try {
            List<SystemUser> response = systemUserService.list();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

}
