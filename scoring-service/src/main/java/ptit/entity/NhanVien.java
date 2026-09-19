package ptit.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Nhan_vien")
public class NhanVien {

    @Id
    private String id;

    @Field("ma_nhan_vien")
    private String maNhanVien;

    @Field("ten_nhan_vien")
    private String tenNhanVien;

    @Field("ngay_sinh")
    private String ngaySinh; // nvarchar 'dd/MM/yyyy'

    @Field("que_quan")
    private String queQuan;

    @Field("ma_phong_ban")
    private String maPhongBan;

}
