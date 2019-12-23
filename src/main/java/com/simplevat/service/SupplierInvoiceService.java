package com.simplevat.service;

import com.simplevat.entity.SupplierInvoice;
import java.util.List;

public abstract class SupplierInvoiceService extends SimpleVatService<Integer, SupplierInvoice> {

    public abstract List<SupplierInvoice> getSupplierInvoiceList();

    public abstract void deleteByIds(List<Integer> ids);

}
