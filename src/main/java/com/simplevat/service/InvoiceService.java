package com.simplevat.service;

import com.simplevat.constant.dbfilter.InvoiceFilterEnum;
import com.simplevat.entity.Invoice;
import java.util.List;
import java.util.Map;

public abstract class InvoiceService extends SimpleVatService<Integer, Invoice> {

    public abstract List<Invoice> getInvoiceList(Map<InvoiceFilterEnum, Object> map);

    public abstract void deleteByIds(List<Integer> ids);

}
