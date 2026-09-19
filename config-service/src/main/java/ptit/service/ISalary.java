package ptit.service;

import ptit.entity.Salary;

import java.util.List;

public interface ISalary {

    String createSalary(Salary salary);

    String updateSalary(Salary salary);

    List<Salary> reportSalary(String maNV);

}
