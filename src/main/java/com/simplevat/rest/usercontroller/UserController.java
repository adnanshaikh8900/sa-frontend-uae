/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.usercontroller;

import com.simplevat.bank.model.DeleteModel;
import com.simplevat.entity.Mail;
import com.simplevat.entity.MailEnum;
import com.simplevat.entity.Role;
import com.simplevat.entity.User;
import com.simplevat.integration.MailIntegration;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ConfigurationService;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserServiceNew;
import com.simplevat.constant.EmailConstant;
import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.utils.FileHelper;
import com.simplevat.utils.MailConfigurationModel;
import com.simplevat.utils.MailUtility;

import io.swagger.annotations.ApiOperation;

import java.io.File;
import java.io.Serializable;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/user")
public class UserController implements Serializable {

	@Autowired
	private UserServiceNew userService;

	@Autowired
	private FileHelper fileUtility;

	@Autowired
	private RoleService roleService;

	@Autowired
	private ConfigurationService configurationService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private CompanyService companyService;

	@Autowired
	private UserRestHelper userRestHelper;

	private boolean isEmailPresent = false;

	@ApiOperation(value = "Get User List")
	@GetMapping(value = "/getList")
	private ResponseEntity getUserList(UserRequestFilterModel filterModel) {
		try {
			Map<UserFilterEnum, Object> filterDataMap = new HashMap<UserFilterEnum, Object>();
			filterDataMap.put(UserFilterEnum.FIRST_NAME, filterModel.getName());
			filterDataMap.put(UserFilterEnum.DELETE_FLAG, false);
			filterDataMap.putIfAbsent(UserFilterEnum.DOB, filterModel.getDob());
			if (filterModel.getCompanyId() != null) {
				filterDataMap.put(UserFilterEnum.COMPANY, companyService.findByPK(filterModel.getCompanyId()));
			}
			if (filterModel.getRoleId() != null) {
				filterDataMap.put(UserFilterEnum.ROLE, roleService.findByPK(filterModel.getRoleId()));
			}

			List<User> userList = null;

			userList = userService.getUserList(filterDataMap);

			if (userList == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				return new ResponseEntity<>(userRestHelper.getModelList(userList), HttpStatus.OK);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Delete User")
	@DeleteMapping(value = "/delete")
	public ResponseEntity deleteUser(@RequestParam(value = "id") Integer id) {
		User user = userService.findByPK(id);
		try {
			if (user == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);

			} else {
				user.setDeleteFlag(true);
				userService.update(user);

			}
			return new ResponseEntity(HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}

	@ApiOperation(value = "Delete User In Bulks")
	@DeleteMapping(value = "/deletes")
	public ResponseEntity deleteUsers(@RequestBody DeleteModel ids) {
		try {
			userService.deleteByIds(ids.getIds());
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Save New User")
	@PostMapping(value = "/save")
	public ResponseEntity save(@RequestBody UserModel selectedUser, HttpServletRequest request) {

		Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);

		boolean isUserNew = true;
		User creatingUser = userService.findByPK(userId);
		String password = selectedUser.getPassword();
		if (selectedUser.getId() != null) {
			User user = userService.getUserEmail(selectedUser.getEmail());
			isUserNew = user == null || !user.getUserId().equals(selectedUser.getId());
		}
		if (isUserNew) {
			Optional<User> userOptional = userService.getUserByEmail(selectedUser.getEmail());
			if (userOptional.isPresent()) {
				isEmailPresent = true;
				return new ResponseEntity<>("Email Id already Exist", HttpStatus.FORBIDDEN);
			}
		}
		if (!isEmailPresent) {
			try {

				if (password != null && !password.trim().isEmpty()) {
					BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
					String encodedPassword = passwordEncoder.encode(password);
					selectedUser.setPassword(encodedPassword);
				}
				User user = userRestHelper.getEntity(selectedUser);
				// BeanUtils.copyProperties(selectedUser, user);

				user.setCompany(creatingUser.getCompany());
				user.setCreatedBy(creatingUser.getUserId());
				user.setLastUpdatedBy(creatingUser.getUserId());
				if (user.getUserId() == null) {
					userService.persist(user);
					sendNewUserMail(user, password);
					return new ResponseEntity("User Profile saved successfully", HttpStatus.CREATED);
				} else {
					userService.update(user, user.getUserId());
					return new ResponseEntity("User Profile updated successfully", HttpStatus.CREATED);
				}
			} catch (Exception ex) {
				Logger.getLogger(UserController.class.getName()).log(Level.SEVERE, null, ex);
			}
		}
		return new ResponseEntity(HttpStatus.NOT_FOUND);
	}

	@ApiOperation(value = "Update User")
	@PostMapping(value = "/update")
	public ResponseEntity editUser(@RequestBody UserModel userModel, HttpServletRequest request) {
		User user = null;
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			user = userRestHelper.getEntity(userModel);
			if (userModel.getPassword() != null && !userModel.getPassword().trim().isEmpty()) {
				BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
				String encodedPassword = passwordEncoder.encode(userModel.getPassword());
				userModel.setPassword(encodedPassword);
			}
			user.setLastUpdateDate(LocalDateTime.now());
			user.setLastUpdatedBy(userId);
			userService.update(user);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Get UserBy Id")
	@DeleteMapping(value = "/getById")
	public ResponseEntity deleteUsers(@RequestParam(value = "id") Integer id) {
		try {
			User user = userService.findByPK(id);
			if (user == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(userRestHelper.getModel(user), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Get Role List")
	@GetMapping(value = "/getrole")
	public ResponseEntity<List<Role>> comoleteRole() {
		List<Role> roles = roleService.getRoles();
		if (roles != null) {
			return new ResponseEntity<>(roles, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

	}

	@ApiOperation(value = "Get Current User")
	@GetMapping(value = "/current")
	public ResponseEntity<User> currentUser(HttpServletRequest request) {
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			User user = userService.findByPK(userId);
			return new ResponseEntity<>(user, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private String sendNewUserMail(User user, String passwordToMail) {
		final String NEW_USER_EMAIL_TEMPLATE_FILE = "emailtemplate/new-user-created-template.html";
		try {
			MailEnum mailEnum = MailEnum.NEW_USER_CREATED;
			String recipientName = user.getFirstName();
			String url = "http://" + System.getenv("SIMPLEVAT_SUBDOMAIN") + "." + System.getenv("SIMPLEVAT_ENVIRONMENT")
					+ ".simplevat.com";
			String userMail = user.getUserEmail();
			Object[] args = { recipientName, url, userMail, passwordToMail };
			ClassLoader classLoader = getClass().getClassLoader();
			File file = new File(classLoader.getResource(NEW_USER_EMAIL_TEMPLATE_FILE).getFile());
			String pathname = file.getAbsolutePath();
			MessageFormat msgFormat = new MessageFormat(fileUtility.readFile(pathname));
			MimeMultipart mimeMultipart = fileUtility.getMessageBody(msgFormat.format(args));
			String[] email = { userMail };
			MailConfigurationModel mailDefaultConfigurationModel = MailUtility
					.getEMailConfigurationList(configurationService.getConfigurationList());
			sendActivationMail(mailEnum, mimeMultipart, mailDefaultConfigurationModel.getMailusername(), email);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private void sendActivationMail(MailEnum mailEnum, MimeMultipart mimeMultipart, String userName,
			String[] senderMailAddress) {
		Thread t = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					Mail mail = new Mail();
					mail.setFrom(userName);
					mail.setFromName(EmailConstant.ADMIN_EMAIL_SENDER_NAME);
					mail.setTo(senderMailAddress);
					mail.setSubject(mailEnum.getSubject());
					MailIntegration.sendHtmlEmail(mimeMultipart, mail,
							MailUtility.getJavaMailSender(configurationService.getConfigurationList()));
				} catch (Exception ex) {
					java.util.logging.Logger.getLogger(UserController.class.getName()).log(Level.SEVERE, null, ex);
				}
			}
		});
		t.start();
	}
}
