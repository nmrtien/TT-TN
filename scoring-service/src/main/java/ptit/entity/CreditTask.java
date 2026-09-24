package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "credit_task")
public class CreditTask {

    @Id
    private String id;

    @Field("application_id")
    private String applicationId;

    @Field("assignee")
    private String assignee;

    @Field("role_group")
    private RoleGroup roleGroup;

    @Field("score")
    private String score;

    @Field("comment")
    private String comment;

    @Field("models")
    private List<Model> models;

    @Field("create_time")
    private LocalDateTime createTime;

    @Field("update_time")
    private LocalDateTime updateTime;

    @Field("status")
    private CreditStatus status;

    private CreditApplication application;

    private String nextTaskId;

    private String errorMsg;

}
