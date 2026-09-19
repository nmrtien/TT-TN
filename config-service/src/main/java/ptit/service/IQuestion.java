package ptit.service;

import ptit.entity.Model;
import ptit.entity.Question;

import java.util.List;

public interface IQuestion {

    String create(Question question);

    String update(Question question);

    Question detail(String id);

    List<Question> list();

}
