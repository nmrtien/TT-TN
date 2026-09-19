package ptit.service;

import ptit.entity.CreditApplication;
import ptit.entity.CreditTask;

import java.util.List;

public interface IScoring {

    String createApplication(CreditApplication application);

    String closeApplication(String applicationId);

    String completeTask(CreditTask task);


}
