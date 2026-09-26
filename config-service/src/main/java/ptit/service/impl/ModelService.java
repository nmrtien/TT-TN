package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.Model;
import ptit.entity.Question;
import ptit.repository.ModelRepository;
import ptit.service.IModel;
import ptit.service.IQuestion;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ModelService implements IModel {

    private final ModelRepository modelRepository;

    private final IQuestion questionService;

    @Override
    public String create(Model model) {
        String result = validateModel(model);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        List<Model> models = modelRepository.findAllByModelCode(model.getModelCode());
        if (!CollectionUtils.isEmpty(models))
            return "KHÔNG THÀNH CÔNG. MÃ MÔ HÌNH ĐÃ TỒN TẠI";
        model.setId(null);
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
        model.setModelCode(modelSaved.getModelCode());
        return saveModel(model);
    }


    @Override
    public Model detail(String id) {
        Model model = modelRepository.findById(id).orElse(new Model());
        String modelCode = model.getModelCode();
        if (model.getId() == null || !StringUtils.hasLength(modelCode))
            return model;
        List<Question> questions = questionService.list(modelCode);
        model.setQuestions(questions);
        return model;
    }


    @Override
    public List<Model> list() {
        return modelRepository.findAllByOrderByModelNameDesc();
    }


    @Override
    public List<Model> list(String roleGroup) {
        List<Model> models = modelRepository.findAllByRoleGroup(roleGroup);
        if (CollectionUtils.isEmpty(models))
            return models;
        Set<String> modelCodes = models.stream()
                .map(Model::getModelCode)
                .collect(Collectors.toSet());
        List<Question> questions = questionService.list(modelCodes);
        if (CollectionUtils.isEmpty(questions))
            return models;
        Map<String, List<Question>> map = questions.stream()
                .collect(Collectors.groupingBy(Question::getModelCode));
        for (Model model : models) {
            model.setQuestions(map.get(model.getModelCode()));
        }
        return models;
    }


    private String saveModel(Model model) {
        modelRepository.save(model);
        List<Question> questions = model.getQuestions();
        Set<String> questionIds = questions.stream()
                .map(Question::getId)
                .filter(StringUtils::hasLength)
                .collect(Collectors.toSet());
        questionService.updateQuestion(questionIds, model.getModelCode());
        String result = "THÀNH CÔNG";
        log.info(result);
        return result;
    }


    private String validateModel(Model model) {
        if (model == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN MÔ HÌNH KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(model.getModelCode()))
            return "KHÔNG THÀNH CÔNG. MÃ MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(model.getModelName()))
            return "KHÔNG THÀNH CÔNG. TÊN MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (model.getRoleGroup() == null)
            return "KHÔNG THÀNH CÔNG. NHÓM QUYỀN MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (CollectionUtils.isEmpty(model.getQuestions()))
            return "KHÔNG THÀNH CÔNG. DANH SÁCH CÂU HỎI CỦA MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        Set<String> questionIds = model.getQuestions().stream()
                .map(Question::getId)
                .filter(StringUtils::hasLength)
                .collect(Collectors.toSet());
        if (CollectionUtils.isEmpty(questionIds))
            return "KHÔNG THÀNH CÔNG. DANH SÁCH CÂU HỎI CỦA MÔ HÌNH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        return null;
    }
}
