package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import ptit.constant.RoleGroup;

import java.math.BigDecimal;
import java.util.List;

@Data
@Document(collection = "model")
public class Model {

    @Id
    private String id;

    @Field("model_code")
    private String modelCode;

    @Field("model_name")
    private String modelName;

    @Field("role_group")
    private RoleGroup roleGroup;

    private List<Question> questions;
}
