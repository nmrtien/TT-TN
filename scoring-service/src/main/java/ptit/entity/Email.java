package ptit.entity;

import lombok.Data;

import java.util.Set;

@Data
public class Email {

    private String subject;

    private String content;

    private Set<String> to;

    private Set<String> cc;

}
