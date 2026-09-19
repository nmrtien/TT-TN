package ptit.service;

import ptit.entity.Model;

import java.util.List;

public interface ISalary {

    String createSalary(Model salary);

    String updateSalary(Model salary);

    List<Model> reportSalary(String maNV);

}
