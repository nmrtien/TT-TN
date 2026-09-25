package ptit.entity;

import lombok.Data;
import ptit.constant.ActiveStatus;
import ptit.constant.RoleGroup;

@Data
public class SystemUser {

    private String id;

    private String userName;

    private String password;

    private String fullName;

    private String email;

    private String phone;

    private String birthday;

    private String position;

    private RoleGroup roleGroup;

    private ActiveStatus status;
}
