package com.simplevat.service;

import java.util.List;
import java.util.Optional;

import com.simplevat.entity.User;

public abstract class UserService extends SimpleVatService<Integer, User> {

    public abstract Optional<User> getUserByEmail(String emailAddress);

    public abstract User getUserEmail(String emailAddress);

    public abstract List<User> findAll();

    public abstract boolean authenticateUser(String usaerName, String password);

    public abstract List<User> getAllUserNotEmployee();

    public abstract void deleteByIds(List<Integer> ids);
}
