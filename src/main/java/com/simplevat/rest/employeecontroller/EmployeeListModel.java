/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.employeecontroller;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Builder;
import lombok.Data;

/**
 *
 * @author admin
 */
@Data
@Builder
public class EmployeeListModel {

    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String mobileNumber;

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        if (firstName != null && !firstName.isEmpty()) {
            sb.append(firstName).append(" ");
        }
        if (middleName != null && !middleName.isEmpty()) {
            sb.append(middleName).append(" ");
        }
        if (lastName != null && !lastName.isEmpty()) {
            sb.append(lastName);
        }
        return sb.toString();
    }
}
