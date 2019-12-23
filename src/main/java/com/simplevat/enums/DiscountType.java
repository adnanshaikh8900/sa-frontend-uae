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
public enum DiscountType {

    FIXED("Fixed"),
    PERCENTAGE("Percentage");

    private String desc;

    DiscountType(String desc) {
        this.desc = desc;
    }

    public String toString() {
        return name();
    }

    public String getDesc() {
        return desc;
    }

    public static List<DiscountType> contactTypeList() {
        List<DiscountType> discountTypes = new ArrayList<DiscountType>();
        for (DiscountType discountType : values()) {
            discountTypes.add(discountType);
        }
        return discountTypes;
    }

}
