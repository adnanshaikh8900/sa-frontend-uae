package com.simplevat.rest.companycontroller;

import java.math.BigDecimal;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CompanyModel {

	private MultipartFile companyLogo;
	private String companyName;
	private String companyRegistrationNumber;
	private String vatRegistrationNumber;
	private Integer companyTypeCode;
	private Integer industryTypeCode;
	private String phoneNumber;
	private String emailAddress;
	private String website;
	private String invoicingAddressLine1;
	private String invoicingAddressLine2;
	private String invoicingAddressLine3;
	private String invoicingCity;
	private String invoicingStateRegion;
	private String invoicingPostZipCode;
	private String invoicingPoBoxNumber;
	private Integer invoicingCountryCode;
	private Integer currencyCode;
	private String companyAddressLine1;
	private String companyAddressLine2;
	private String companyAddressLine3;
	private String companyCity;
	private String companyStateRegion;
	private String companyPostZipCode;
	private String companyPoBoxNumber;
	private Integer companyCountryCode;
	private BigDecimal companyExpenseBudget;
	private BigDecimal companyRevenueBudget;
	private String dateFormat;
	private byte[] companyLogoByteArray;
}
