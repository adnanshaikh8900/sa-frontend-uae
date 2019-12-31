package com.simplevat.dao.impl;

import com.simplevat.constant.dbfilter.DbFilter;
import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import java.util.List;

import org.springframework.stereotype.Repository;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.Invoice;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;
import com.simplevat.dao.InvoiceDao;
import com.simplevat.rest.DropdownModel;

@Repository
public class InvoiceDaoImpl extends AbstractDao<Integer, Invoice> implements InvoiceDao {

    @Override
    public List<Invoice> getInvoiceList(Map<InvoiceFilterEnum, Object> filterMap) {
        List<DbFilter> dbFilters = new ArrayList();
        filterMap.forEach((productFilter, value) -> dbFilters.add(DbFilter.builder()
                .dbCoulmnName(productFilter.getDbColumnName())
                .condition(productFilter.getCondition())
                .value(value).build()));
        List<Invoice> invoices = this.executeQuery(dbFilters);
        return invoices;
    }

    @Override
    public List<DropdownModel> getInvoicesForDropdown() {
        List<DropdownModel> empSelectItemModels = getEntityManager()
                .createNamedQuery("invoiceForDropdown", DropdownModel.class)
                .getResultList();
        return empSelectItemModels;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                Invoice supplierInvoice = findByPK(id);
                supplierInvoice.setDeleteFlag(Boolean.TRUE);
                update(supplierInvoice);
            }
        }
    }
}
