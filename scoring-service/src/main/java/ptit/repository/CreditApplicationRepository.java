package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.constant.CreditStatus;
import ptit.entity.CreditApplication;
import java.util.List;
import java.util.Optional;


public interface CreditApplicationRepository extends MongoRepository<CreditApplication, String> {

    List<CreditApplication> findByStatusOrderByCreateTimeDesc(CreditStatus status);

    List<CreditApplication> findByLegalDocTypeAndLegalDocNumberAndStatus(String legalDocType,
                                                                         String legalDocNumber,
                                                                         String status);

}
