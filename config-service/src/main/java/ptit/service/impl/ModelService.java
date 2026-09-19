package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.Model;
import ptit.proxy.EmployeeClient;
import ptit.repository.ModelRepository;
import ptit.service.IModel;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModelService implements IModel {

    private final ModelRepository modelRepository;
    private final EmployeeClient employeeClient;

    @Override
    public String create(Model model) {
        String result = validateModel(model);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        return saveModel(model);
    }


    @Override
    public String update(Model model) {
        String result = validateModel(model);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        if (!StringUtils.hasLength(model.getId()))
            return "KHÔNG THÀNH CÔNG. THÔNG TIN ID KHÔNG HỢP LỆ";
        Model modelSaved = modelRepository.findById(model.getId()).orElse(null);
        if (modelSaved == null) {
            result = "KHÔNG THÀNH CÔNG. MÃ ID KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }
        return saveModel(model);
    }


    @Override
    public Model detail(String id) {
        return modelRepository.findById(id).orElse(new Model());
    }


    @Override
    public List<Model> list() {
        return modelRepository.findAllByOrderByModelNameDesc();
    }


    private String saveModel(Model model) {
        modelRepository.save(model);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }


    private String validateModel(Model model) {
        if (model == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN MÔ HÌNH KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(model.getModelCode()))
            return "KHÔNG THÀNH CÔNG. MÃ MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(model.getModelName()))
            return "KHÔNG THÀNH CÔNG. TÊN MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (model.getModelLevel() == null)
            return "KHÔNG THÀNH CÔNG. CẤP MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (CollectionUtils.isEmpty(model.getQuestions()))
            return "KHÔNG THÀNH CÔNG. DANH SÁCH CÂU HỎI CỦA MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        return null;
    }
}
