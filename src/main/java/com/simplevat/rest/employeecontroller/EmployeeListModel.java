package com.simplevat.rest.employeecontroller;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author admin
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeListModel implements Serializable{

    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String email;

    private String password;

    private LocalDateTime dob;

    private String referenceCode;

    private String title;

    private String billingEmail;

    private String vatRegestationNo;

    private Integer currencyCode;

    private String poBoxNumber;

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
