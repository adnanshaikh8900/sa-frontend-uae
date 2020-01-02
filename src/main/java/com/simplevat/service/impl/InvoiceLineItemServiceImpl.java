package com.simplevat.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.entity.InvoiceLineItem;
import com.simplevat.service.InvoiceLineItemService;
import com.simplevat.dao.InvoiceLineItemDao;

@Service("SupplierInvoiceLineItemService")
public class InvoiceLineItemServiceImpl extends InvoiceLineItemService {

    @Autowired
    private InvoiceLineItemDao supplierInvoiceLineItemDao;

    @Override
    protected Dao<Integer, InvoiceLineItem> getDao() {
        return supplierInvoiceLineItemDao;
    }
  
}
