/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.contact.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 *
 * @author uday
 */
@Data
public class Transaction {

    private int id;
    private String transactionDate;
    private String description;
    private String drAmount;
    private String crAmount;
    private Boolean validData;
    private String format;
    private String date;
    private String credit;
    private String debit;
    
}
