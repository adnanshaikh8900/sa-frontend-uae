package com.simplevat.service;

import com.simplevat.constant.dbfilter.SupplierInvoiceFilterEnum;
import com.simplevat.entity.SupplierInvoice;
import java.util.List;
import java.util.Map;

public abstract class SupplierInvoiceService extends SimpleVatService<Integer, SupplierInvoice> {

    public abstract List<SupplierInvoice> getSupplierInvoiceList(Map<SupplierInvoiceFilterEnum, Object> map);

    public abstract void deleteByIds(List<Integer> ids);

}
