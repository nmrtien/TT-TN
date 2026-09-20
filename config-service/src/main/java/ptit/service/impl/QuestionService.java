package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.Question;
import ptit.repository.QuestionRepository;
import ptit.service.IQuestion;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestion {

    private final QuestionRepository questionRepository;

    @Override
    public String create(Question question) {
        String result = validateQuestion(question);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        List<Question> questions = questionRepository.findAllByQuestionCode(question.getQuestionCode());
        if (!CollectionUtils.isEmpty(questions))
            return "KHÔNG THÀNH CÔNG. MÃ CÂU HỎI ĐÃ TỒN TẠI";
        question.setId(null);
        return saveQuestion(question);
    }


    @Override
    public String update(Question question) {
        String result = validateQuestion(question);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        if (!StringUtils.hasLength(question.getId()))
            return "KHÔNG THÀNH CÔNG. THÔNG TIN ID KHÔNG HỢP LỆ";
        Question questionSaved = questionRepository.findById(question.getId()).orElse(null);
        if (questionSaved == null) {
            result = "KHÔNG THÀNH CÔNG. MÃ ID KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }
        question.setQuestionCode(questionSaved.getQuestionCode());
        return saveQuestion(question);
    }


    @Override
    public Question detail(String id) {
        return questionRepository.findById(id).orElse(new Question());
    }


    @Override
    public List<Question> list() {
        return questionRepository.findAllByOrderByQuestionNameDesc();
    }


    @Override
    public List<Question> listValid() {
        return questionRepository.findAllByModelCodeIsNullOrderByQuestionNameDesc();
    }


    @Override
    public List<Question> listDetail(String modelCode) {
        return questionRepository.findAllByModelCodeOrModelCodeIsNullOrderByQuestionNameDesc(modelCode);
    }


    @Override
    public List<Question> list(String modelCode) {
        return questionRepository.findAllByModelCode(modelCode);
    }


    @Override
    public List<Question> list(Set<String> modelCodes) {
        return questionRepository.findAllByModelCodeIn(modelCodes);
    }


    @Override
    public void updateQuestion(Set<String> questionIds, String modelCode) {
        List<Question> questions = questionRepository.findAllByQuestionCode(modelCode);
        if (!CollectionUtils.isEmpty(questions)) {
            Set<String> questionIdsSaved = questions.stream()
                    .map(Question::getId)
                    .filter(StringUtils::hasLength)
                    .collect(Collectors.toSet());
            questionRepository.updateModelCodeByQuestionIds(questionIdsSaved, null);
        }
        questionRepository.updateModelCodeByQuestionIds(questionIds, modelCode);
    }


    private String saveQuestion(Question question) {
        questionRepository.save(question);
        String result = "THÀNH CÔNG";
        log.error(result);
        return result;
    }


    private String validateQuestion(Question question) {
        if (question == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN CÂU HỎI KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(question.getQuestionCode()))
            return "KHÔNG THÀNH CÔNG. MÃ CÂU HỎI KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(question.getQuestionName()))
            return "KHÔNG THÀNH CÔNG. TÊN CÂU HỎI KHÔNG ĐƯỢC ĐỂ TRỐNG";
        return null;
    }
}
