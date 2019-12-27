/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.enums;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ashish
 */
public enum ContactTypeEnum {

    SUPPLIER("Supplier", 1),
    CUSTOMER("Customer", 2),
    BOTH("Both", 3);

    private String desc;
    private Integer value;

    ContactTypeEnum(String desc, Integer value) {
        this.desc = desc;
        this.value = value;
    }

    public String toString() {
        return name();
    }

    public String getDesc() {
        return desc;
    }

    public Integer getValue() {
        return value;
    }

    public static List<ContactTypeEnum> contactTypeList() {
        List<ContactTypeEnum> contactTypes = new ArrayList<ContactTypeEnum>();
        for (ContactTypeEnum contactType : values()) {
            contactTypes.add(contactType);
        }
        return contactTypes;
    }

}
