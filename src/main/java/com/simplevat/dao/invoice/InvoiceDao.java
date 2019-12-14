package com.simplevat.dao.invoice;

import com.simplevat.contact.model.InvoiceReportRestModel;
import java.util.Date;
import java.util.List;

import com.simplevat.dao.Dao;
import com.simplevat.entity.invoice.Invoice;

/**
 *
 * @author hiren
 * @since 20 May, 2017 7:34:45 PM
 */
public interface InvoiceDao extends Dao<Integer, Invoice> {

    /**
     * This methods take date duration and calculate Invoices per month wise
     *
     * @param startDate
     * @param endDate
     * @return List Of Invoice, month wise
     */
    public List<Object[]> getInvocePerMonth(Date startDate, Date endDate);

    /**
     * This methods will return all the invoices within that perticular range of
     * date supplied
     *
     * @param startDate
     * @param endDate
     * @return
     */
    public List<Object[]> getInvoices(Date startDate, Date endDate);

    /**
     * This methods take date duration and calculate VatIn per month wise
     *
     * @param startDate
     * @param endDate
     * @return List Of Invoice, month wise
     */
    public List<Object[]> getVatInPerMonth(Date startDate, Date endDate);

    /**
     * This methods return list of event due for given date range
     *
     * @param startDate
     * @param endDate
     * @return
     */
    public List<Object[]> getInvoiceDue(Date startDate, Date endDate);

    public List<Invoice> getInvoiceListByDueDate();

    public List<Invoice> getInvoiceListByDueAmount();

    public Invoice getClosestDueInvoiceByContactId(Integer contactId);

    public List<InvoiceReportRestModel> getInvoicesForReports(String refNumber, Date invoiceStartDate, Date invoiceEndDate, Date invoiceDueStartDate, Date invoiceDueEndDate, Integer contactId, Integer pageNo, Integer pageSize);

    public List<Invoice> getInvoiceList();

    public void deleteByIds(List<Integer> ids);
}
