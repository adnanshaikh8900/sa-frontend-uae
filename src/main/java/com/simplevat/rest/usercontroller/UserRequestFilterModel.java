package com.simplevat.rest.usercontroller;

import java.util.Date;

import lombok.Data;

@Data
public class UserRequestFilterModel {

	private String name;
	private Date dob;
	private Integer roleId;
	private boolean active;
	private Integer companyId;
	//company to discussed
	
}
