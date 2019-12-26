package com.simplevat.dao.impl;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.SupplierInvoiceFilterEnum;
import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.SupplierInvoiceDao;
import com.simplevat.entity.SupplierInvoice;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class SupplierInvoiceDaoImpl extends AbstractDao<Integer, SupplierInvoice> implements SupplierInvoiceDao {

    @Override
    public List<SupplierInvoice> getSupplierInvoiceList(Map<SupplierInvoiceFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList();
        filterMap.forEach((productFilter, value) -> dbFilters.add(DbFilter.builder()
                .dbCoulmnName(productFilter.getDbColumnName())
                .condition(productFilter.getCondition())
                .value(value).build()));
        List<SupplierInvoice> invoices = this.executeQuery(dbFilters);
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
