package ptit.service;

import ptit.entity.SystemUser;

import java.util.List;
import java.util.Set;

public interface ISystemUser {

    String create(SystemUser salary);

    String update(SystemUser salary);

    SystemUser detail(String id);

    List<SystemUser> getUsers(Set<String> userName);

    SystemUser detail(String username, String password);

    List<SystemUser> list();

}
