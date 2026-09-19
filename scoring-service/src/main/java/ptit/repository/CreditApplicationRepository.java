package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.CreditApplication;
import java.util.List;
import java.util.Optional;


public interface CreditApplicationRepository extends MongoRepository<CreditApplication, String> {

    List<CreditApplication> findByLegalDocTypeAndLegalDocNumberAndStatus(String legalDocType,
                                                                         String legalDocNumber,
                                                                         String status);

}
