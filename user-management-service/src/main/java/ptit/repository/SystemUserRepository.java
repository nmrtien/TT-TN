package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.SystemUser;

import java.util.List;

public interface SystemUserRepository extends MongoRepository<SystemUser, String> {

    List<SystemUser> findAllByUserName(String userName);

    List<SystemUser> findAllByOrderByUserNameDesc();

}