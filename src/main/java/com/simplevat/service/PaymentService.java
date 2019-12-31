/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.service;

import com.simplevat.constant.dbfilter.PaymentFilterEnum;
import com.simplevat.entity.Payment;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Ashish
 */
public abstract class PaymentService extends SimpleVatService<Integer, Payment> {
    
    public abstract List<Payment> getPayments(Map<PaymentFilterEnum, Object> map);
    
    public abstract void deleteByIds(List<Integer> ids);

}
