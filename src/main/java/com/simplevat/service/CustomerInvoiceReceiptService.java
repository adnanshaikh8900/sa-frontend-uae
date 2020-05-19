package com.simplevat.service;

import com.simplevat.entity.CustomerInvoiceReceipt;

public abstract class CustomerInvoiceReceiptService extends SimpleVatService<Integer, CustomerInvoiceReceipt> {

	public abstract Integer findNextReceiptNoForInvoice(Integer invoiceId);

	public abstract CustomerInvoiceReceipt findForReceipt(Integer receiptId);
}
