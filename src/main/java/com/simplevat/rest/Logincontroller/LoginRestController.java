package com.simplevat.rest.Logincontroller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.simplevat.entity.User;
import com.simplevat.model.JwtRequest;
import com.simplevat.service.UserService;
import com.simplevat.util.RandomString;
import com.simplevat.utils.DateUtils;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/public")
public class LoginRestController {

	@Autowired
	private UserService userService;

	@ApiOperation(value = "forgotPassword")
	@PostMapping(value = "/forgotPassword")
	public ResponseEntity forgotPassword(@RequestBody JwtRequest jwtRequest) {

		Map<String, String> attribute = new HashMap<String, String>();
		attribute.put("userEmail", jwtRequest.getUsername());
		List<User> userList = userService.findByAttributes(attribute);
		if (userList == null || (userList != null && userList.isEmpty()))
			return new ResponseEntity(HttpStatus.UNAUTHORIZED);

		User user = userList.get(0);
		if (userService.updateForgotPasswordToken(user))
			return new ResponseEntity(HttpStatus.OK);
		return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ApiOperation(value = "resetPassword")
	@PostMapping(value = "/resetPassword")
	public ResponseEntity resetPassword(@RequestBody ResetPasswordModel resetPasswordModel) {

		Map<String, String> attribute = new HashMap<String, String>();
		attribute.put("forgotPasswordToken", resetPasswordModel.getToken());
		List<User> userList = userService.findByAttributes(attribute);
		if (userList == null || (userList != null && userList.isEmpty()) || (userList != null && !userList.isEmpty()
				&& userList.get(0).getForgotPasswordTokenExpiryDate().isBefore(LocalDateTime.now())))
			return new ResponseEntity(HttpStatus.UNAUTHORIZED);

		User user = userList.get(0);
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String encodedPassword = passwordEncoder.encode(resetPasswordModel.getPassword());
		user.setPassword(encodedPassword);
		user.setForgotPasswordToken(null);
		user.setForgotPasswordTokenExpiryDate(null);
		userService.persist(user);
		return new ResponseEntity(HttpStatus.OK);

	}
}
