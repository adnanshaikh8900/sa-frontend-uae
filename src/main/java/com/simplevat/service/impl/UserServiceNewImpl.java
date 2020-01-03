package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.dao.UserNewDao;
import com.simplevat.entity.User;
import com.simplevat.service.UserServiceNew;
import java.io.Serializable;

@Service("userServiceNew")
public class UserServiceNewImpl extends UserServiceNew implements Serializable {

    @Autowired
    @Qualifier(value = "userDao")
    private UserNewDao dao;

    @Override
    public UserNewDao getDao() {
        return dao;
    }

    @Override
    public List<User> findAll() {
        return this.executeNamedQuery("findAllUsers");
    }

    @Override
    public Optional<User> getUserByEmail(String emailAddress) {
        return getDao().getUserByEmail(emailAddress);
    }

    @Override
    public User getUserEmail(String emailAddress) {
        return getDao().getUserEmail(emailAddress);
    }

    @Override
    public boolean authenticateUser(String usaerName, String password) {
        return getDao().getUserByEmail(usaerName, password);
    }

    @Override
    public List<User> getAllUserNotEmployee() {
        return getDao().getAllUserNotEmployee();
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
        getDao().deleteByIds(ids);
    }
    
    @Override
	public List<User> getUserList(Map<UserFilterEnum, Object> filterMap){
		return dao.getUserList(filterMap); 
	}
}
