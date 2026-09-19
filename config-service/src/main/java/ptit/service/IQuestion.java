package ptit.service;

import ptit.entity.Question;

import java.util.List;
import java.util.Set;

public interface IQuestion {

    String create(Question question);

    String update(Question question);

    Question detail(String id);

    List<Question> list();

    List<Question> list(String modelCode);

    List<Question> list(Set<String> modelCode);

    void updateQuestion(Set<String> questionIds, String modelCode);

}
