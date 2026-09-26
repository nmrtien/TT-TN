package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.Model;

import java.util.List;

public interface ModelRepository extends MongoRepository<Model, String> {

    List<Model> findAllByModelCode(String modelCode);

    List<Model> findAllByRoleGroup(String roleGroup);

    List<Model> findAllByOrderByModelNameDesc();

}