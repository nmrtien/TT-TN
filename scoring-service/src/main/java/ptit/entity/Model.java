package ptit.entity;

import lombok.Data;

import java.util.List;

@Data
public class Model {

    private String id;

    private String modelCode;

    private String modelName;

    private Integer modelLevel;

    private List<Question> questions;
}
