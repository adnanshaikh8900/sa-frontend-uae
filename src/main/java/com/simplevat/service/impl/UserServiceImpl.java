package com.simplevat.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.mail.MessagingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.simplevat.constant.EmailConstant;
import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.entity.User;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.UserService;
import com.simplevat.util.EmailSender;
import com.simplevat.util.RandomString;
import com.simplevat.utils.DateUtils;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.simplevat.dao.UserDao;

@Service("userService")
public class UserServiceImpl extends UserService{

	private final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

	
	@Value("${simplevat.baseUrl}")
	private String baseUrl;

	@Autowired
	@Qualifier(value = "userDao")
	private UserDao dao;

	@Autowired
	private RandomString randomString;

	@Autowired
	private EmailSender emailSender;

	@Autowired
	private DateUtils dateUtils;

	@Override
	public UserDao getDao() {
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
	public PaginationResponseModel getUserList(Map<UserFilterEnum, Object> filterMap, PaginationModel paginationModel) {
		return dao.getUserList(filterMap, paginationModel);
	}

	@Override
	public boolean updateForgotPasswordToken(User user) {

		String token = randomString.getAlphaNumericString(30);
		try {
			emailSender.send(user.getUserEmail(), "Rset Password",
					emailSender.resetPassword.replace("LINK", baseUrl + "/reset-password?token=" + token),
					EmailConstant.ADMIN_SUPPORT_EMAIL, true);
		} catch (MessagingException e) {
			LOGGER.error("Error", e);
			return false;
		}
		user.setForgotPasswordToken(token);
		user.setForgotPasswordTokenExpiryDate(dateUtils.add(LocalDateTime.now(), 1));
		persist(user);
		return true;
	}
}
