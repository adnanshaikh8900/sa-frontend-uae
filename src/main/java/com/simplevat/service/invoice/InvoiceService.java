//package com.simplevat.service.invoice;
//
//import com.simplevat.contact.model.InvoiceReportRestModel;
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import com.simplevat.dao.invoice.InvoiceDao;
//import com.simplevat.entity.Event;
//import com.simplevat.entity.invoice.Invoice;
//import com.simplevat.service.SimpleVatService;
//import com.simplevat.service.report.model.BankAccountTransactionReportModel;
//
///**
// *
// * @author Hiren
// */
//public abstract class InvoiceService extends SimpleVatService<Integer, Invoice> {
//
//    @Autowired
//    private InvoiceDao invoiceDao;
//
//    public abstract Map<Object, Number> getInvoicePerMonth();
//
//    public abstract Map<Object, Number> getInvoicePerMonth(Date startDate, Date endDate);
//
//    public abstract int getMaxValue(Map<Object, Number> data);
//
//    public abstract Map<Object, Number> getVatInPerMonth();
//
//    public abstract int getVatInQuartly();
//
//    public abstract List<Event> getInvoiceAsEvent();
//
//    public abstract List<Invoice> getInvoiceListByDueDate();
//
//    public abstract List<Invoice> getInvoiceListByDueAmount();
//
//    public abstract Invoice getClosestDueInvoiceByContactId(Integer contactId);
//
//    public abstract List<InvoiceReportRestModel> getInvoicesForReports(String refNumber, Date invoiceStartDate, Date invoiceEndDate, Date invoiceDueStartDate, Date invoiceDueEndDate, Integer contactId, Integer pageNo, Integer pageSize);
//
//    public abstract List<Invoice> getInvoiceList();
//
//    public abstract void deleteByIds(List<Integer> ids);
//
//    @Override
//    protected InvoiceDao getDao() {
//        return invoiceDao;
//    }
//}
