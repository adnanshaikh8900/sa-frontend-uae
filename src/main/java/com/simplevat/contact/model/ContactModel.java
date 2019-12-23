package com.simplevat.contact.model;

import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Hiren
 */
@Getter
@Setter
public class ContactModel implements Serializable {

    private static final long serialVersionUID = -7492170073928262949L;

    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String organization;

    private String email;

    private String billingEmail;

    private String telephone;

    private String mobileNumber;

    private String addressLine1;

    private String addressLine2;

    private String addressLine3;

    private String postZipCode;

    private String poBoxNumber;

    private String contractPoNumber;

    private Boolean deleteFlag = Boolean.FALSE;

    private Country country;

    private Currency currency;

    private ContactType contactType;

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
