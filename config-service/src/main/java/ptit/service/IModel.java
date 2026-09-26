package ptit.service;

import ptit.entity.Model;

import java.util.List;

public interface IModel {

    String create(Model model);

    String update(Model model);

    Model detail(String id);

    List<Model> list();

    List<Model> list(String roleGroup);

}
