package ptit.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ptit.constant.RoleGroup;
import ptit.entity.CreditTask;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CreditTaskRepository extends MongoRepository<CreditTask, String> {

    List<CreditTask> findAllByApplicationIdIn(Set<String> applicationIds);

    List<CreditTask> findAllByRoleGroupAndAssigneeIsNull(RoleGroup roleGroup);

    List<CreditTask> findAllByRoleGroupAndAssignee(RoleGroup roleGroup, String assignee);

    List<CreditTask> findAllByAssignee(String assignee);

    CreditTask findByApplicationIdAndAssigneeAndRoleGroup(String applicationId, String assignee, RoleGroup roleGroup);

}