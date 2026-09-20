package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.CreditTask;
import java.util.List;
import java.util.Optional;

public interface CreditTaskRepository extends MongoRepository<CreditTask, String> {

}