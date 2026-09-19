package ptit.service;

import ptit.entity.NhanVien;
import ptit.entity.PhongBan;

import java.util.List;

public interface IManagement {

    PhongBan getPhongBan(String maPB);

    List<NhanVien> getNhanVienByPhongBan(String maPB);
}
