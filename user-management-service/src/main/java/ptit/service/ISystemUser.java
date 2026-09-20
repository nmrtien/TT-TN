package ptit.service;

import ptit.entity.SystemUser;

import java.util.List;

public interface ISystemUser {

    String create(SystemUser salary);

    String update(SystemUser salary);

    SystemUser detail(String id);

    SystemUser detail(String username, String password);

    List<SystemUser> list();

}
