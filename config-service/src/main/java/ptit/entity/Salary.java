package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;

@Data
@Document(collection = "Salary")
public class Salary {

    @Id
    private String id;

    @Field("ma_nhan_vien")
    private String maNhanVien;

    @Field("money")
    private BigDecimal money;

    @Field("month_of_salary")
    private String monthOfSalary;

    @Field("year_of_salary")
    private String yearOfSalary;

    @Field("salary_type")
    private String salaryType; // SALARY/BONUS

    private BigDecimal totalSalary;
}
