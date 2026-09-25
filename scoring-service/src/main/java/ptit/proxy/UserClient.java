package ptit.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ptit.entity.Email;
import ptit.entity.SystemUser;

import java.util.List;

@FeignClient(name = "user-management-service", url = "http://localhost:8081/api/v1/users")
public interface UserClient {

    @PostMapping("/detail")
    List<SystemUser> getUsers(@RequestBody Email request);

}
