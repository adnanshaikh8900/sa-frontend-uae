package com.simplevat.rest.usercontroller;

import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {

	private Integer id;

	private String firstName;

	private String lastName;

	private boolean active;

	private Date dob;

	private Integer roleId;

	private String roleName;

	private Integer companyId;

	private String companyName;

	private String password;

	private String email;

	private MultipartFile attachmentFile;

	public String getFullName() {
		StringBuilder sb = new StringBuilder();
		if (firstName != null && !firstName.isEmpty()) {
			sb.append(firstName).append(" ");
		}
		if (lastName != null && !lastName.isEmpty()) {
			sb.append(lastName);
		}
		return sb.toString();
	}
}
