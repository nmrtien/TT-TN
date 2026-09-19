package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ptit.entity.NhanVien;
import ptit.entity.PhongBan;
import ptit.repository.NhanVienRepository;
import ptit.repository.PhongBanRepository;
import ptit.service.IManagement;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManagementService implements IManagement {

    private final PhongBanRepository phongBanRepo;
    private final NhanVienRepository nhanVienRepo;


    @Override
    public PhongBan getPhongBan(String maPB) {

        return phongBanRepo.findByMaPhongBan(maPB).orElse(null);
    }

    @Override
    public List<NhanVien> getNhanVienByPhongBan(String maPB) {

        return nhanVienRepo.findByMaPhongBanOrderByTenNhanVienDesc(maPB);
    }


}
