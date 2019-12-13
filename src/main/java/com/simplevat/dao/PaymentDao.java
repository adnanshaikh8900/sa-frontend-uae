/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import com.simplevat.entity.Payment;
import java.util.List;

/**
 *
 * @author Ashish
 */
public interface PaymentDao extends Dao<Integer, Payment> {

    public List<Payment> getPayments();

    public void deleteByIds(List<Integer> ids);

}
