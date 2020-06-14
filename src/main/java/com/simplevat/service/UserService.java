package com.simplevat.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.entity.User;
import com.simplevat.rest.DropdownModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

public abstract class UserService extends SimpleVatService<Integer, User> {

	public abstract Optional<User> getUserByEmail(String emailAddress);

	public abstract User getUserEmail(String emailAddress);

	public abstract List<User> findAll();

	public abstract boolean authenticateUser(String usaerName, String password);

	public abstract List<User> getAllUserNotEmployee();

	public abstract void deleteByIds(List<Integer> ids);

	public abstract PaginationResponseModel getUserList(Map<UserFilterEnum, Object> filterMap,PaginationModel paginationModel);

	public abstract boolean updateForgotPasswordToken(User user);

	public abstract List<DropdownModel> getUserForDropdown();
}
