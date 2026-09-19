package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;

@Data
@Document(collection = "question")
public class Question {

    @Id
    private String id;

    @Field("question_code")
    private String questionCode;

    @Field("question_name")
    private String questionName;

    @Field("model_code")
    private String modelCode;

    private String questionAnswer;
}
