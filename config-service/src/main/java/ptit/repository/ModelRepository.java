package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.Model;

import java.util.List;

public interface ModelRepository extends MongoRepository<Model, String> {

    List<Model> findAllByModelCode(String modelCode);

    List<Model> findAllByModelLevel(Integer modelLevel);

    List<Model> findAllByOrderByModelNameDesc();

}