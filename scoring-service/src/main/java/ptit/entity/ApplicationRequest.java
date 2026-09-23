package ptit.entity;

import lombok.Data;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;

@Data
public class ApplicationRequest {

    private String taskId;

    private String userName;

    private RoleGroup roleGroup;

    private CreditStatus status;

}
