/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import java.time.LocalDateTime;
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

    private String mobileNumber;

    private String addressLine1;

    private String addressLine2;

    private String addressLine3;

    private Integer countryId;

    private String postZipCode;

    private Integer createdBy;

    private LocalDateTime createdDate;

    private Integer lastUpdatedBy;

    private LocalDateTime lastUpdateDate;

}
