package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.NhanVien;
import java.util.List;
import java.util.Optional;

public interface NhanVienRepository extends MongoRepository<NhanVien, String> {

    Optional<NhanVien> findByMaNhanVien(String maNhanVien);

    List<NhanVien> findByMaPhongBanOrderByTenNhanVienDesc(String maPhongBan);
}