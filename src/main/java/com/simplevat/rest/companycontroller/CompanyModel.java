package com.simplevat.rest.companycontroller;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CompanyModel {

	private MultipartFile companyLogo;
	private Integer id;
	private String CompanyName;
	private Integer industryTypeCode;
	private String companyAddressLine1;
	private String companyAddressLine2;
	private String companyCity;
	private String companyState;
	private Integer companycountryCode;
	private String companyPostZipCode;
	private String contactPersionName;
	private String emailAddress;
	private String phoneNumber;
	private String CompanyId;
	private String vatRegistrationNumber;
}
