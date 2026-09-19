package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.PhongBan;
import java.util.List;
import java.util.Optional;


public interface PhongBanRepository extends MongoRepository<PhongBan, String> {

    List<PhongBan> findAllByOrderByTenPhongBanDesc();

    Optional<PhongBan> findByMaPhongBan(String maPhongBan);
}
