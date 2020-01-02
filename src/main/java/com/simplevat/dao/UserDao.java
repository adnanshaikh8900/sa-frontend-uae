package com.simplevat.dao;

import java.util.Optional;

import com.simplevat.entity.User;
import java.util.List;

public interface UserDao extends Dao<Integer, User> {

    public Optional<User> getUserByEmail(String emailAddress);

    public User getUserEmail(String emailAddress);

    public boolean getUserByEmail(String usaerName, String password);

    public List<User> getAllUserNotEmployee();

    public void deleteByIds(List<Integer> ids);
}
    