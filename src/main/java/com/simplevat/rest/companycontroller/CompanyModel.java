package com.simplevat.rest.companycontroller;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CompanyModel {

    private MultipartFile companyLogo;
    private Integer id;
    private String name;
    private Integer industryTypeCode;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private Integer countryCode;
    private String postZipCode;
    private String contactPersonName;
    private String contactEmailAddress;
    private String contactPhoneNumber;
    private String phoneNumber;
    private String companyRegistrationId;
    private String vatNumber;
}
