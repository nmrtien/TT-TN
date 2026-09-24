package ptit.service;

import ptit.constant.CreditStatus;
import ptit.entity.*;

import java.util.List;

public interface IScoring {

    CreditTask createApplication(CreditApplication application);

    List<CreditApplication> getApplications(ApplicationRequest request);

//    List<CreditApplication> getApplications(CreditStatus status);

    CreditTask detailTask(ApplicationRequest request);

    CreditTask closeApplication(String taskId);

    CreditTask claimTask(ClaimTask claimTask);

    CreditTask getTask(String taskId);

    CreditTask completeTask(CreditTask task);

    List<Model> getModels(Integer level);

    List<CreditTask> getAllTasks();
}
