package com.simplevat.rest.projectcontroller;

import lombok.Data;

@Data
public class ProjectRequestFilterModel {

	private Integer productId;
	private String projectName;
	private Integer userId;
	private boolean deleteFlag;

}
