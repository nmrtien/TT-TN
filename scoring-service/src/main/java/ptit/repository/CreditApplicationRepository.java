package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.constant.CreditStatus;
import ptit.entity.CreditApplication;
import java.util.List;
import java.util.Set;


public interface CreditApplicationRepository extends MongoRepository<CreditApplication, String> {

    List<CreditApplication> findAllByIdInOrderByCreateTimeDesc(Set<String> ids);

    List<CreditApplication> findAllByOrderByCreateTimeDesc();

    List<CreditApplication> findByStatusOrderByCreateTimeDesc(CreditStatus status);

    List<CreditApplication> findByLegalDocTypeAndLegalDocNumberAndStatus(String legalDocType,
                                                                         String legalDocNumber,
                                                                         String status);

}
