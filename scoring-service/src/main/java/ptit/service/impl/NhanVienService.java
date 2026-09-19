package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ptit.entity.NhanVien;
import ptit.entity.PhongBan;
import ptit.repository.NhanVienRepository;
import ptit.service.IManagement;
import ptit.service.INhanVien;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NhanVienService implements INhanVien {

    private final NhanVienRepository nhanVienRepo;
    private final IManagement management;


    @Override
    public String createNhanVien(NhanVien nv) {

        String result = validateNhanVien(nv);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        NhanVien nvCheck = nhanVienRepo.findByMaNhanVien(nv.getMaNhanVien()).orElse(null);
        if (nvCheck != null) {
            result = "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN ĐÃ TỒN TẠI";
            log.error(result);
            return result;
        }

        return saveNhanVien(nv);
    }

    @Override
    public String updateNhanVien(NhanVien nv) {

        String result = validateNhanVien(nv);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        NhanVien nvCheck = nhanVienRepo.findByMaNhanVien(nv.getMaNhanVien()).orElse(null);
        if (nvCheck == null) {
            result = "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }

        nv.setId(nvCheck.getId());
        return saveNhanVien(nv);
    }

    @Override
    public String deleteNhanVien(String maNV) {

        String result = "XÓA NHÂN VIÊN " + maNV + " ";
        NhanVien nv = nhanVienRepo.findByMaNhanVien(maNV).orElse(null);
        if (nv == null) {
            result = result + " KHÔNG THÀNH CÔNG DO KHÔNG TÌM THẤY NHÂN VIÊN";
            log.error(result);
            return result;
        }

        nhanVienRepo.delete(nv);
        result = result + " THÀNH CÔNG";
        log.info(result);
        return result;
    }

    @Override
    public NhanVien getNhanVien(String maNV) {

        return nhanVienRepo.findByMaNhanVien(maNV).orElse(null);
    }

    @Override
    public List<NhanVien> getNhanVienByPhongBan(String maPB) {

        return management.getNhanVienByPhongBan(maPB);
    }

    private String validateNhanVien(NhanVien nv) {

        if (nv == null)
            return "KHÔNG THÀNH CÔNG. NHÂN VIÊN KHÔNG ĐƯỢC PHÉP NULL";

        if (!StringUtils.hasLength(nv.getMaNhanVien()) || !StringUtils.hasLength(nv.getTenNhanVien())
                || !StringUtils.hasLength(nv.getMaPhongBan()))
            return "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN, TÊN NHÂN VIÊN VÀ MÃ PHÒNG BAN KHÔNG ĐƯỢC ĐỂ TRỐNG";

        PhongBan pb = management.getPhongBan(nv.getMaPhongBan());
        if (pb == null)
            return "KHÔNG THÀNH CÔNG. MÃ PHÒNG BAN KHÔNG TỒN TẠI";

        return null;
    }

    private String saveNhanVien(NhanVien nv) {

        nhanVienRepo.save(nv);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }
}
