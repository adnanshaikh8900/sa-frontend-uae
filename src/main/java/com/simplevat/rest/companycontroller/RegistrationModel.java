package com.simplevat.rest.companycontroller;

import lombok.Data;

@Data
public class RegistrationModel {
    private String companyName;
    private Integer companyTypeCode;
    private Integer industryTypeCode;
    private Integer currencyCode;
    private String firstName;
    private String lastName;
    private String password;
    private String email;
}

