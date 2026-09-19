package ptit.service;

import ptit.entity.PhongBan;

import java.util.List;

public interface IPhongBan {

    String createPhongBan(PhongBan pb);

    String updatePhongBan(PhongBan pb);

    List<PhongBan> getAllPhongBan();

    String deletePhongBan(String maPB);

}
