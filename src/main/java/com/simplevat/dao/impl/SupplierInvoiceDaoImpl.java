package com.simplevat.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.SupplierInvoiceDao;
import com.simplevat.entity.SupplierInvoice;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class SupplierInvoiceDaoImpl extends AbstractDao<Integer, SupplierInvoice> implements SupplierInvoiceDao {

    @Override
    public List<SupplierInvoice> getSupplierInvoiceList() {
        List<SupplierInvoice> invoices = this.executeNamedQuery("allSupplierInvoices");
        return invoices;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                SupplierInvoice supplierInvoice = findByPK(id);
                supplierInvoice.setDeleteFlag(Boolean.TRUE);
                update(supplierInvoice);
            }
        }
    }
}
