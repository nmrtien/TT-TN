package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import ptit.constant.CreditStatus;

import java.time.LocalDateTime;

@Data
@Document(collection = "credit_application")
public class CreditApplication {

    @Id
    private String id;

    @Field("cif")
    private String cif;

    @Field("legal_doc_type")
    private String legalDocType;

    @Field("legal_doc_number")
    private String legalDocNumber;

    @Field("full_name")
    private String fullName;

    @Field("birthday")
    private String birthday;

    @Field("address")
    private String address;

    @Field("phone")
    private String phone;

    @Field("email")
    private String email;

    @Field("spouse_cif")
    private String spouseCif;

    @Field("spouse_legal_doc_type")
    private String spouseLegalDocType;

    @Field("spouse_legal_doc_number")
    private String spouseLegalDocNumber;

    @Field("spouse_full_name")
    private String spouseFullName;

    @Field("spouse_phone")
    private String spousePhone;

    @Field("spouse_email")
    private String spouseEmail;

    @Field("loan_purpose")
    private String loanPurpose;

    @Field("loan_term")
    private String loanTerm;

    @Field("create_time")
    private LocalDateTime createTime;

    @Field("update_time")
    private LocalDateTime updateTime;

    @Field("create_by")
    private String createBy;

    @Field("status")
    private CreditStatus status;

    private String latestTaskId;

    private String errorMsg;

}
