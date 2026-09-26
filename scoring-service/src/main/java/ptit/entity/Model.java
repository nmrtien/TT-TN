package ptit.entity;

import lombok.Data;
import ptit.constant.RoleGroup;

import java.util.List;

@Data
public class Model {

    private String id;

    private String modelCode;

    private String modelName;

    private RoleGroup roleGroup;

    private List<Question> questions;
}
