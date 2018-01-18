package com.simplevat.service;

import java.util.List;
import java.util.Optional;

import com.simplevat.entity.User;

public abstract class UserServiceNew extends SimpleVatService<Integer, User> {

    public abstract Optional<User> getUserByEmail(String emailAddress);

    public abstract List<User> findAll();

    public abstract boolean authenticateUser(String usaerName, String password);

}
