package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ptit.entity.Model;
import ptit.proxy.EmployeeClient;
import ptit.repository.SalaryRepository;
import ptit.service.ISalary;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SalaryService implements ISalary {

    private final SalaryRepository salaryRepository;
    private final EmployeeClient employeeClient;

    @Override
    public String createSalary(Model salary) {

        String result = validateSalary(salary);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        return saveSalary(salary);
    }

    @Override
    public String updateSalary(Model salary) {

        String result = validateSalary(salary);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }

        Model salarySaved = salaryRepository.findById(salary.getId()).orElse(null);
        if (salarySaved == null) {
            result = "KHÔNG THÀNH CÔNG. MÃ KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }

        return saveSalary(salary);
    }

    @Override
    public List<Model> reportSalary(String maNV) {

        //        Salary salary = new Salary();
//        if (salaryList.isEmpty())
//            return salary;
//
//        for (Salary s : salaryList) {
//            salary.set
//        }
        return salaryRepository.findByMaNhanVien(maNV);
    }

    private String saveSalary(Model salary) {

        salaryRepository.save(salary);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }

    private String validateSalary(Model salary) {

        if (salary == null)
            return "KHÔNG THÀNH CÔNG. LƯƠNG THƯỞNG KHÔNG ĐƯỢC PHÉP NULL";

        if (!StringUtils.hasLength(salary.getMaNhanVien()) || salary.getMoney() == null
                || !StringUtils.hasLength(salary.getSalaryType()))
            return "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN, TIỀN VÀ LOẠI LƯƠNG/THƯỞNG KHÔNG ĐƯỢC ĐỂ TRỐNG";

        String maNV = employeeClient.getMaNV(salary.getMaNhanVien());
        if (!StringUtils.hasLength(maNV))
            return "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN KHÔNG TỒN TẠI";

        return null;
    }
}
