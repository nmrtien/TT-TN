package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.Model;

import java.util.List;

public interface SalaryRepository extends MongoRepository<Model, String> {

    List<Model> findByMaNhanVien(String maNhanVien);

}