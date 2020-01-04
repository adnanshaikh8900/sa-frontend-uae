package com.simplevat.rest.usercontroller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.User;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserService;

@Component
public class UserRestHelper {

	@Autowired
	private RoleService roleService;

	@Autowired
	private UserService userService;

	public List<UserModel> getModelList(List<User> userList) {

		List<UserModel> userModelList = new ArrayList<UserModel>();

		if (userList != null && userList.size() > 0) {

			for (User user : userList) {
				UserModel userModel = new UserModel();

				userModel.setId(user.getUserId());
				userModel.setFirstName(user.getFirstName());
				userModel.setLastName(user.getLastName());
				if (user.getDateOfBirth() != null) {
					Date date = Date.from(user.getDateOfBirth().atZone(ZoneId.systemDefault()).toInstant());
					userModel.setDob(date);
				}
				if (user.getRole() != null) {
					userModel.setRoleId(user.getRole().getRoleCode());
					userModel.setRoleName(user.getRole().getRoleName());
				}
				if (user.getCompany() != null) {
					userModel.setCompanyId(user.getCompany().getCompanyId());
					userModel.setCompanyName(user.getCompany().getCompanyName());
				}

				userModelList.add(userModel);
			}
		}

		return userModelList;
	}

	public User getEntity(UserModel userModel) {

		if (userModel != null) {
			User user = new User();
			if (userModel.getId() != null) {
				user = userService.findByPK(userModel.getId());
			}
			user.setFirstName(userModel.getFirstName());
			user.setLastName(userModel.getLastName());
			user.setUserEmail(userModel.getEmail());
			if (userModel.getDob() != null) {
				LocalDateTime dob = Instant.ofEpochMilli(userModel.getDob().getTime()).atZone(ZoneId.systemDefault())
						.toLocalDateTime();
				user.setDateOfBirth(dob);
			}
			if (userModel.getRoleId() != null) {
				user.setRole(roleService.findByPK(userModel.getRoleId()));
			}
			user.setIsActive(userModel.isActive());
			if (userModel.getPassword() != null && userModel.getPassword().equals("")) {
				user.setPassword(userModel.getPassword());
			}
			if (userModel.getProfilePic() != null) {
				try {
					user.setProfileImageBinary(userModel.getProfilePic().getBytes());
				} catch (IOException e) {
					e.printStackTrace();
					Logger.getLogger(UserRestHelper.class.getName()).log(Level.SEVERE, null, e);
				}
			}
			return user;
		}

		return null;
	}

	public UserModel getModel(User user) {

		if (user != null) {
			UserModel userModel = new UserModel();

			userModel.setId(user.getUserId());
			userModel.setFirstName(user.getFirstName());
			userModel.setLastName(user.getLastName());
			userModel.setEmail(user.getUserEmail());
			if (user.getDateOfBirth() != null) {
				Date date = Date.from(user.getDateOfBirth().atZone(ZoneId.systemDefault()).toInstant());
				userModel.setDob(date);
			}
			if (user.getRole() != null) {
				userModel.setRoleId(user.getRole().getRoleCode());
				userModel.setRoleName(user.getRole().getRoleName());
			}
			if (user.getCompany() != null) {
				userModel.setCompanyId(user.getCompany().getCompanyId());
				userModel.setCompanyName(user.getCompany().getCompanyName());
			}

			return userModel;
		}

		return null;
	}

}
