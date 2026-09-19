package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.NhanVien;
import ptit.entity.PhongBan;
import ptit.repository.PhongBanRepository;
import ptit.service.IManagement;
import ptit.service.IPhongBan;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhongBanService implements IPhongBan {

    private final PhongBanRepository phongBanRepo;
    private final IManagement management;

    @Override
    public String createPhongBan(PhongBan pb) {

        String result = validatePhongBan(pb);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        PhongBan pbCheck = phongBanRepo.findByMaPhongBan(pb.getMaPhongBan()).orElse(null);
        if (pbCheck != null) {
            result = "KHÔNG THÀNH CÔNG. MÃ PHÒNG BAN ĐÃ TỒN TẠI";
            log.error(result);
            return result;
        }

        return savePhongBan(pb);
    }

    @Override
    public String updatePhongBan(PhongBan pb) {

        String result = validatePhongBan(pb);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        PhongBan pbCheck = phongBanRepo.findByMaPhongBan(pb.getMaPhongBan()).orElse(null);
        if (pbCheck == null) {
            result = "KHÔNG THÀNH CÔNG. MÃ PHÒNG BAN KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }

        pb.setId(pbCheck.getId());
        return savePhongBan(pb);
    }

    @Override
    public List<PhongBan> getAllPhongBan() {

        return phongBanRepo.findAllByOrderByTenPhongBanDesc();
    }

    @Override
    public String deletePhongBan(String maPB) {

        String result = "XÓA PHÒNG BAN " + maPB + " ";
        PhongBan pb = phongBanRepo.findByMaPhongBan(maPB).orElse(null);
        if (pb == null) {
            result = result + " KHÔNG THÀNH CÔNG DO KHÔNG TÌM THẤY PHÒNG BAN";
            log.error(result);
            return result;
        }

        List<NhanVien> listNV = management.getNhanVienByPhongBan(maPB);
        if (!CollectionUtils.isEmpty(listNV)) {
            result = result + "KHÔNG THÀNH CÔNG DO PHÒNG BAN VẪN CÒN NHÂN VIÊN";
            log.error(result);
            return result;
        }

        phongBanRepo.delete(pb);
        result = result + "THÀNH CÔNG";
        log.info(result);
        return result;
    }

    private String validatePhongBan(PhongBan pb) {

        if (pb == null)
            return "KHÔNG THÀNH CÔNG. PHÒNG BAN KHÔNG ĐƯỢC PHÉP NULL";

        if (!StringUtils.hasLength(pb.getMaPhongBan()) || !StringUtils.hasLength(pb.getTenPhongBan()))
            return "KHÔNG THÀNH CÔNG. MÃ PHÒNG BAN VÀ TÊN PHÒNG BAN KHÔNG ĐƯỢC ĐỂ TRỐNG";

        return null;
    }

    private String savePhongBan(PhongBan pb) {

        phongBanRepo.save(pb);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }
}
