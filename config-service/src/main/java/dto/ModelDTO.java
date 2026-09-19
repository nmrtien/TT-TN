package dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;

@Data
@Document(collection = "Salary")
public class ModelDTO {

    @Id
    private String id;

    @Field("model_code")
    private String modelCode;

    @Field("model_name")
    private String model_Name;

    @Field("month_of_salary")
    private String monthOfSalary;

    @Field("year_of_salary")
    private String yearOfSalary;

    @Field("salary_type")
    private String salaryType; // SALARY/BONUS

    private BigDecimal totalSalary;
}
