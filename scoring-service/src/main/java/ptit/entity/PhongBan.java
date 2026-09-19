package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Phong_ban")
public class PhongBan {

    @Id
    private String id;

    @Field("ma_phong_ban")
    private String maPhongBan;

    @Field("ten_phong_ban")
    private String tenPhongBan;

    @Field("mo_ta")
    private String moTa;

}
