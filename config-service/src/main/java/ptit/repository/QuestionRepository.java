package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import ptit.entity.Question;

import java.util.List;
import java.util.Set;

public interface QuestionRepository extends MongoRepository<Question, String> {

    List<Question> findAllByModelCodeIn(Set<String> modelCodes);

    List<Question> findAllByModelCode(String modelCode);

    List<Question> findAllByQuestionCode(String questionCode);

    List<Question> findAllByOrderByQuestionNameDesc();

    List<Question> findAllByModelCodeIsNullOrderByQuestionNameDesc();

    List<Question> findAllByModelCodeOrModelCodeIsNullOrderByQuestionNameDesc(String modelCode);

    @Query("{ '_id': { $in: ?0 } }")
    @Update("{ '$set': { 'modelCode': ?1 } }")
    void updateModelCodeByQuestionIds(Set<String> questionIds, String modelCode);

}