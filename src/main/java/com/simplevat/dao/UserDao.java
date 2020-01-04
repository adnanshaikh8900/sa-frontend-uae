package com.simplevat.dao;

import java.util.Optional;

import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.entity.User;
import java.util.List;
import java.util.Map;

public interface UserDao extends Dao<Integer, User> {

    public Optional<User> getUserByEmail(String emailAddress);

    public User getUserEmail(String emailAddress);

    public boolean getUserByEmail(String usaerName, String password);

    public List<User> getAllUserNotEmployee();

    public void deleteByIds(List<Integer> ids);

	public List<User> getUserList(Map<UserFilterEnum, Object> filterMap);
}
    