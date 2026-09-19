package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.Salary;

import java.util.List;

public interface SalaryRepository extends MongoRepository<Salary, String> {

    List<Salary> findByMaNhanVien(String maNhanVien);

}