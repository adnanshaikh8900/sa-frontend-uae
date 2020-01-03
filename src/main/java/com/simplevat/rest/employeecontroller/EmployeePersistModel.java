/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Builder;
import lombok.Data;

/**
 *
 * @author admin
 */
@Data
@Builder
public class EmployeePersistModel {

    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private Integer createdBy;

    private LocalDateTime createdDate;

    private Integer lastUpdatedBy;

    private LocalDateTime lastUpdateDate;

    //saurabhg 2/1/2020
    private Date dob;

    private String referenceCode;

    private String title;

    private String billingEmail;

    private String vatRegestationNo;

    private Integer currencyCode;

    private String poBoxNumber;

    private String password;

}
