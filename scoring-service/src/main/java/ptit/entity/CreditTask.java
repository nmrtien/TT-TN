package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;

@Data
@Document(collection = "Nhan_vien")
public class CreditTask {

    @Id
    private String id;

    @Field("application_id")
    private String applicationId;

    @Field("assignee")
    private String assignee;

    @Field("role_group")
    private RoleGroup roleGroup;

    @Field("comment")
    private String comment;

    @Field("status")
    private CreditStatus status;

}
