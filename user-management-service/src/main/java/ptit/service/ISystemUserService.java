package ptit.service;

import ptit.entity.SystemUser;

import java.util.List;

public interface ISystemUserService {

    String create(SystemUser salary);

    String update(SystemUser salary);

    SystemUser detail(String id);

    List<SystemUser> list();

}
