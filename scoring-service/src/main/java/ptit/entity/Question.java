package ptit.entity;

import lombok.Data;

@Data
public class Question {

    private String id;

    private String questionCode;

    private String questionName;

    private String modelCode;

    private String questionAnswer;
}
