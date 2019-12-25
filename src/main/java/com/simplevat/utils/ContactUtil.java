/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.utils;

import com.simplevat.constant.ContactTypeConstant;
import com.simplevat.contact.model.ContactType;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author admin
 */
public class ContactUtil {

    public static List<ContactType> contactTypeList() {
        List<ContactType> contactTypeList = new ArrayList<>();
        contactTypeList.add(new ContactType(ContactTypeConstant.CUSTOMER, "Customer"));
        contactTypeList.add(new ContactType(ContactTypeConstant.SUPPLIER, "Vendor"));
        return contactTypeList;
    }
}
