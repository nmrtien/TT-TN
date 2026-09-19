package ptit.service;

import ptit.entity.NhanVien;

import java.util.List;

public interface INhanVien {

    String createNhanVien(NhanVien nv);

    String updateNhanVien(NhanVien nv);

    String deleteNhanVien(String maNV);

    NhanVien getNhanVien(String maNV);

    List<NhanVien> getNhanVienByPhongBan(String maPB);
}
