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
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserService;
import com.simplevat.utils.DateFormatUtil;

@Component
public class UserRestHelper {

	@Autowired
	private RoleService roleService;

	@Autowired
	private UserService userService;

	@Autowired
	private DateFormatUtil dateUtil;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	public List<UserModel> getModelList(Object userList) {

		List<UserModel> userModelList = new ArrayList<UserModel>();

		if (userList != null) {

			for (User user : (List<User>) userList) {
				UserModel userModel = new UserModel();

				userModel.setId(user.getUserId());
				userModel.setFirstName(user.getFirstName());
				userModel.setLastName(user.getLastName());
				userModel.setActive(user.getIsActive());
				if (user.getDateOfBirth() != null) {
					// Date date =
					// Date.from(user.getDateOfBirth().atZone(ZoneId.systemDefault()).toInstant());
					userModel.setDob(dateUtil.getDateAsString(user.getDateOfBirth(), "dd-MM-yyyy"));
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
					e.printStackTrace();
					Logger.getLogger(UserRestHelper.class.getName()).log(Level.SEVERE, null, e);
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

				userModel.setDob(dateUtil.getDateAsString(user.getDateOfBirth(), "dd-MM-yyyy"));
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
