package ptit.service;

import ptit.constant.CreditStatus;
import ptit.entity.CreditApplication;
import ptit.entity.CreditTask;
import ptit.entity.Model;

import java.util.List;

public interface IScoring {

    CreditTask createApplication(CreditApplication application);

    List<CreditApplication> getApplications(CreditStatus status);

    CreditTask closeApplication(String taskId);

    CreditTask claimTask(String taskId, String assignee);

    CreditTask getTask(String taskId);

    CreditTask completeTask(CreditTask task);

    List<Model> getModels(Integer level);
}
