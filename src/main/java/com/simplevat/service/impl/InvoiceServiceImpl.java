package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.entity.Invoice;
import com.simplevat.service.InvoiceService;
import java.util.Map;
import com.simplevat.dao.InvoiceDao;

@Service("SupplierInvoiceService")
public class InvoiceServiceImpl extends InvoiceService {

    @Autowired
    private InvoiceDao supplierInvoiceDao;

    @Override
    protected Dao<Integer, Invoice> getDao() {
        return supplierInvoiceDao;
    }

    @Override
    public List<Invoice> getInvoiceList(Map<InvoiceFilterEnum, Object> map) {
        return supplierInvoiceDao.getInvoiceList(map);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
       supplierInvoiceDao.deleteByIds(ids);
    }

}
