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
import ptit.service.IQuestion;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestion {

    private final ModelRepository modelRepository;
    private final EmployeeClient employeeClient;

    @Override
    public String create(Question model) {
        String result = validateModel(model);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        return saveModel(model);
    }


    @Override
    public String update(Question model) {
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
        return saveQuestion(model);
    }


    @Override
    public Question detail(String id) {
        return modelRepository.findById(id).orElse(new Model());
    }


    @Override
    public List<Question> list() {
        return modelRepository.findAllByOrderByModelNameDesc();
    }


    private String saveQuestion(Question model) {
        modelRepository.save(model);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }


    private String validateQuestion(Model model) {
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
