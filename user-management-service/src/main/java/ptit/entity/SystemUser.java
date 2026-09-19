package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import ptit.constant.ActiveStatus;
import ptit.constant.RoleGroup;

@Data
@Document(collection = "system_user")
public class SystemUser {

    @Id
    private String id;

    @Field("user_name")
    private String userName;

    @Field("full_name")
    private String fullName;

    @Field("email")
    private String email;

    @Field("phone")
    private String phone;

    @Field("birthday")
    private String birthday;

    @Field("position")
    private String position;

    @Field("role_group")
    private RoleGroup roleGroup;

    @Field("status")
    private ActiveStatus status;
}
