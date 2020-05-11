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
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.security.JwtTokenUtil;
import com.simplevat.service.CompanyService;
import com.simplevat.service.ConfigurationService;
import com.simplevat.service.RoleService;
import com.simplevat.service.UserService;
import com.simplevat.constant.EmailConstant;
import com.simplevat.constant.dbfilter.ORDERBYENUM;
import com.simplevat.constant.dbfilter.UserFilterEnum;
import com.simplevat.utils.FileHelper;
import com.simplevat.utils.MailConfigurationModel;
import com.simplevat.utils.MailUtility;

import io.swagger.annotations.ApiOperation;

import java.io.File;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
public class UserController{

	private  Logger logger = LoggerFactory.getLogger(UserController.class);

	@Autowired
	private UserService userService;

	@Autowired
	private  FileHelper fileUtility;

	@Autowired
	private  RoleService roleService;

	@Autowired
	private  ConfigurationService configurationService;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private  CompanyService companyService;

	@Autowired
	private UserRestHelper userRestHelper;

	@Autowired
	private MailIntegration mailIntegration;

	private boolean isEmailPresent = false;

	@ApiOperation(value = "Get User List")
	@GetMapping(value = "/getList")
	public ResponseEntity getUserList(UserRequestFilterModel filterModel) {
		try {
			Map<UserFilterEnum, Object> filterDataMap = new HashMap<>();
			filterDataMap.put(UserFilterEnum.FIRST_NAME, filterModel.getName());
			filterDataMap.put(UserFilterEnum.DELETE_FLAG, false);
			if (filterModel.getActive() != null)
				filterDataMap.put(UserFilterEnum.ACTIVE, filterModel.getActive().equals(1) ? true : false);
			if (filterModel.getDob() != null && !filterModel.getDob().isEmpty()) {
				SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
				LocalDateTime dateTime = Instant.ofEpochMilli(dateFormat.parse(filterModel.getDob()).getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				filterDataMap.put(UserFilterEnum.DOB, dateTime);
			}
			if (filterModel.getCompanyId() != null) {
				filterDataMap.put(UserFilterEnum.COMPANY, companyService.findByPK(filterModel.getCompanyId()));
			}
			if (filterModel.getRoleId() != null) {
				filterDataMap.put(UserFilterEnum.ROLE, roleService.findByPK(filterModel.getRoleId()));
			}
			filterDataMap.put(UserFilterEnum.ORDER_BY, ORDERBYENUM.DESC);
			PaginationResponseModel response = userService.getUserList(filterDataMap, filterModel);
			if (response == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			} else {
				response.setData(userRestHelper.getModelList(response.getData()));
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

		} catch (Exception e) {
			logger.error("Error", e);
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
			logger.error("Error", e);
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
			logger.error("Error", e);
		}
		logger.info("NO DATA FOUND = INTERNAL_SERVER_ERROR");
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Save New User")
	@PostMapping(value = "/save")
	public ResponseEntity save(@ModelAttribute UserModel selectedUser, HttpServletRequest request) {
		try {
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

				if (password != null && !password.trim().isEmpty()) {
					BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
					String encodedPassword = passwordEncoder.encode(password);
					selectedUser.setPassword(encodedPassword);
				}
				User user = userRestHelper.getEntity(selectedUser);
				user.setCompany(creatingUser.getCompany());
				user.setCreatedBy(creatingUser.getUserId());
				user.setLastUpdatedBy(creatingUser.getUserId());
				if (user.getUserId() == null) {
					userService.persist(user);
					return new ResponseEntity("User Profile saved successfully", HttpStatus.OK);
				} else {
					userService.update(user, user.getUserId());
					return new ResponseEntity("User Profile updated successfully", HttpStatus.OK);
				}
			}
		} catch (Exception ex) {
			logger.error("Error", ex);
		}
		logger.info("NO DATA FOUND = INTERNAL_SERVER_ERROR");
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "Update User")
	@PostMapping(value = "/update")
	public ResponseEntity update(@ModelAttribute UserModel userModel, HttpServletRequest request) {
		User user = null;
		try {
			Integer userId = jwtTokenUtil.getUserIdFromHttpRequest(request);
			user = userRestHelper.getEntity(userModel);
			if (userModel.getPassword() != null && !userModel.getPassword().trim().isEmpty()) {
				BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
				String encodedPassword = passwordEncoder.encode(userModel.getPassword());
				user.setPassword(encodedPassword);
			}
			user.setLastUpdateDate(LocalDateTime.now());
			user.setLastUpdatedBy(userId);
			userService.update(user);
			return new ResponseEntity(HttpStatus.OK);
		} catch (Exception e) {
			logger.info("NO DATA FOUND = INTERNAL_SERVER_ERROR");
			return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@ApiOperation(value = "Get UserBy Id")
	@GetMapping(value = "/getById")
	public ResponseEntity getById(@RequestParam(value = "id") Integer id) {
		try {
			User user = userService.findByPK(id);
			if (user == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
			return new ResponseEntity<>(userRestHelper.getModel(user), HttpStatus.OK);
		} catch (Exception e) {
			logger.error("Error", e);
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
			logger.error("Error", e);
		}
		return null;
	}

	private void sendActivationMail(MailEnum mailEnum, MimeMultipart mimeMultipart, String userName,
			String[] senderMailAddress) {
		Thread t = new Thread(() -> {
			try {
				Mail mail = new Mail();
				mail.setFrom(userName);
				mail.setFromName(EmailConstant.ADMIN_EMAIL_SENDER_NAME);
				mail.setTo(senderMailAddress);
				mail.setSubject(mailEnum.getSubject());
				mailIntegration.sendHtmlEmail(mimeMultipart, mail,
						MailUtility.getJavaMailSender(configurationService.getConfigurationList()),false);
			} catch (Exception ex) {
				logger.error("Error", ex);
			}
		});
		t.start();
	}
}
