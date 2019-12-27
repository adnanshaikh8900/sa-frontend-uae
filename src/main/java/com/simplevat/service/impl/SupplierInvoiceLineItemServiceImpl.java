package com.simplevat.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.SupplierInvoiceLineItemDao;
import com.simplevat.entity.SupplierInvoiceLineItem;
import com.simplevat.service.SupplierInvoiceLineItemService;

@Service("SupplierInvoiceLineItemService")
public class SupplierInvoiceLineItemServiceImpl extends SupplierInvoiceLineItemService {

    @Autowired
    private SupplierInvoiceLineItemDao supplierInvoiceLineItemDao;

    @Override
    protected Dao<Integer, SupplierInvoiceLineItem> getDao() {
        return supplierInvoiceLineItemDao;
    }
  
}
