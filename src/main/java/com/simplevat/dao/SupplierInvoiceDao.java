/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import com.simplevat.entity.SupplierInvoice;
import java.util.List;

/**
 *
 * @author daynil
 */
public interface SupplierInvoiceDao extends Dao<Integer, SupplierInvoice> {

    public List<SupplierInvoice> getSupplierInvoiceList();

    public void deleteByIds(List<Integer> ids);

}
