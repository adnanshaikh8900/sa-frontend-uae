package com.simplevat.rest.usercontroller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.entity.User;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserService;
import com.simplevat.utils.DateFormatUtil;

import static com.simplevat.constant.ErrorConstant.ERROR;

@Component
public class UserRestHelper {
	private final Logger logger = LoggerFactory.getLogger(UserRestHelper.class);
	@Autowired
	private RoleService roleService;

	@Autowired
	private UserService userService;

	@Autowired
	private DateFormatUtil dateUtil;

	public List<UserModel> getModelList(Object userList) {
		List<UserModel> userModelList = new ArrayList<>();
		if (userList != null) {
			for (User user : (List<User>) userList) {
				UserModel userModel = new UserModel();
				userModel.setId(user.getUserId());
				userModel.setFirstName(user.getFirstName());
				userModel.setLastName(user.getLastName());
				userModel.setActive(user.getIsActive());
				if (user.getDateOfBirth() != null) {
					userModel.setDob(dateUtil.getLocalDateTimeAsString(user.getDateOfBirth(), "dd-MM-yyyy"));
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
				user.setDateOfBirth(dateUtil.getDateStrAsLocalDateTime(userModel.getDob(), "dd-MM-yyyy"));
			}
			if (userModel.getRoleId() != null) {
				user.setRole(roleService.findByPK(userModel.getRoleId()));
			}
			user.setIsActive(userModel.getActive());
			if (userModel.getPassword() != null && !userModel.getPassword().isEmpty()) {
				user.setPassword(userModel.getPassword());
			}
			if (userModel.getProfilePic() != null) {
				try {
					user.setProfileImageBinary(userModel.getProfilePic().getBytes());
				} catch (IOException e) {
					logger.error(ERROR, e);
				}
			}
			user.setIsActive(userModel.getActive());
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
			userModel.setActive(user.getIsActive());
			if (user.getDateOfBirth() != null) {
				userModel.setDob(dateUtil.getLocalDateTimeAsString(user.getDateOfBirth(), "dd-MM-yyyy"));
			}
			if (user.getRole() != null) {
				userModel.setRoleId(user.getRole().getRoleCode());
				userModel.setRoleName(user.getRole().getRoleName());
			}
			if (user.getCompany() != null) {
				userModel.setCompanyId(user.getCompany().getCompanyId());
				userModel.setCompanyName(user.getCompany().getCompanyName());
			}
			if (user.getProfileImageBinary() != null) {
				userModel.setProfilePicByteArray(user.getProfileImageBinary());
			}
			return userModel;
		}
		return null;
	}
}
