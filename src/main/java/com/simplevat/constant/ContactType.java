/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.constant;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ashish
 */
public enum ContactType {

    SUPPLIER("Supplier"),
    CUSTOMER("Customer"),
    BOTH("Both");

    private String desc;

    ContactType(String desc) {
        this.desc = desc;
    }

    public String toString() {
        return name();
    }

    public String getDesc() {
        return desc;
    }

    public static List<ContactType> contactTypeList() {
        List<ContactType> contactTypes = new ArrayList<ContactType>();
        for (ContactType contactType : values()) {
            contactTypes.add(contactType);
        }
        return contactTypes;
    }

}
