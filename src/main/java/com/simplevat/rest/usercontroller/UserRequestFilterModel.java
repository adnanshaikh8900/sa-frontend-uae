package com.simplevat.rest.usercontroller;

import java.util.Date;

import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;

import lombok.Data;

@Data
public class UserRequestFilterModel extends PaginationModel{

	private String name;
	private String dob;
	private Integer roleId;
	private boolean active;
	private Integer companyId;
	//company to discussed
	
}
