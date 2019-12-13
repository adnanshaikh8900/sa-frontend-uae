/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.service;

import com.simplevat.entity.Payment;
import java.util.List;

/**
 *
 * @author Ashish
 */
public abstract class PaymentService extends SimpleVatService<Integer, Payment> {
    
    public abstract List<Payment> getPayments();

}
