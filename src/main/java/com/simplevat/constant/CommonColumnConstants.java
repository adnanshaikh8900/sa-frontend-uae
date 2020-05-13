package com.simplevat.constant;

public class CommonColumnConstants {

    public static final String FIRST_NAME = "firstName";
    public static final String NAME = "name";
    public static final String EMAIL = "email";
    public static final String CONTACT_TYPE = "contactType";
    public static final String CONTACT_BY_TYPE = "contactsByType";

    /*Query Names*/
    public static final String ALL_CONTACT = "allContacts";
    public static final String CONTACT_BY_NAMES = "Contact.contactsByName";
    public static final String CONTACT_BY_EMAIL ="Contact.contactByEmail";

    private CommonColumnConstants(){
        throw new IllegalStateException("Utility class ContactTypeConstants");
    }
}
