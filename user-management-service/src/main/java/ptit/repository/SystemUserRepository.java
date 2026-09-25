package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.entity.SystemUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SystemUserRepository extends MongoRepository<SystemUser, String> {

    Optional<SystemUser> findByUserNameAndPassword(String username, String password);

    List<SystemUser> findAllByUserName(String userName);

    List<SystemUser> findAllByOrderByUserNameDesc();

    List<SystemUser> findAllByUserNameIn(Set<String> userName);

}