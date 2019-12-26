package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.SupplierInvoiceFilterEnum;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.simplevat.dao.Dao;
import com.simplevat.dao.SupplierInvoiceDao;
import com.simplevat.entity.SupplierInvoice;
import com.simplevat.service.SupplierInvoiceService;
import java.util.Map;

@Service("SupplierInvoiceService")
public class SupplierInvoiceServiceImpl extends SupplierInvoiceService {

    @Autowired
    private SupplierInvoiceDao supplierInvoiceDao;

    @Override
    protected Dao<Integer, SupplierInvoice> getDao() {
        return supplierInvoiceDao;
    }

    @Override
    public List<SupplierInvoice> getSupplierInvoiceList(Map<SupplierInvoiceFilterEnum, Object> map) {
        return supplierInvoiceDao.getSupplierInvoiceList(map);
    }

    @Override
    public void deleteByIds(List<Integer> ids) {
       supplierInvoiceDao.deleteByIds(ids);
    }

}
