/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.dao;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.entity.Invoice;
import com.simplevat.rest.DropdownModel;
import java.util.List;
import java.util.Map;

/**
 *
 * @author daynil
 */
public interface InvoiceDao extends Dao<Integer, Invoice> {

    public List<Invoice> getInvoiceList(Map<InvoiceFilterEnum, Object> map);
    
    public List<DropdownModel> getInvoicesForDropdown();

    public void deleteByIds(List<Integer> ids);

}
