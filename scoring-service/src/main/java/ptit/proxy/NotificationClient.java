package ptit.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ptit.entity.Email;

@FeignClient(name = "notification-service", url = "http://localhost:8084/api/v1/notifications")
public interface NotificationClient {

    @PostMapping()
    void sendEmail(@RequestBody Email request);

}
