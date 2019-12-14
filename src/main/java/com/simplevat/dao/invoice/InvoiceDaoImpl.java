package com.simplevat.dao.invoice;

import com.simplevat.constant.InvoiceStatusConstant;
import com.simplevat.contact.model.InvoiceReportRestModel;
import com.simplevat.dao.AbstractDao;
import com.simplevat.entity.invoice.Invoice;
import com.simplevat.utils.CommonUtil;
import com.simplevat.utils.DateUtils;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Hiren
 */
@Repository
public class InvoiceDaoImpl extends AbstractDao<Integer, Invoice> implements InvoiceDao {

    @Override
    public List<Object[]> getInvocePerMonth(Date startDate, Date endDate) {
        List<Object[]> invoices = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "sum(li.invoiceLineItemUnitPrice*li.invoiceLineItemQuantity) as invoiceTotal, "
                    + "CONCAT(MONTH(i.invoiceDate),'-', Year(i.invoiceDate)) as month "
                    + "from Invoice i JOIN i.invoiceLineItems li "
                    + "where i.deleteFlag = 'false' and li.deleteFlag= 'false' "
                    + "and i.invoiceDate BETWEEN :startDate AND :endDate "
                    + "group by CONCAT(MONTH(i.invoiceDate),'-' , Year(i.invoiceDate))";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            invoices = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return invoices;
    }

    @Override
    public List<Object[]> getInvoices(Date startDate, Date endDate) {
        List<Object[]> invoices = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "sum(li.invoiceLineItemUnitPrice*li.invoiceLineItemQuantity) as invoiceTotal, "
                    + "i.invoiceDate as date, i.invoiceReferenceNumber as refNum,  "
                    + "i.invoiceId as invoiceId "
                    + "from Invoice i JOIN i.invoiceLineItems li "
                    + "where i.deleteFlag = 'false' and li.deleteFlag= 'false' "
                    + "and i.invoiceDate BETWEEN :startDate AND :endDate "
                    + "group by i.invoiceId";
            //+ "order by i.invoiceDate asc";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            invoices = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return invoices;
    }

    @Override
    public List<Object[]> getVatInPerMonth(Date startDate, Date endDate) {
        List<Object[]> invoices = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "sum((li.invoiceLineItemUnitPrice*li.invoiceLineItemQuantity)*li.invoiceLineItemVat/100) as vatInTotal, "
                    + "CONCAT(MONTH(i.invoiceDate),'-' , Year(i.invoiceDate)) as month "
                    + "from Invoice i JOIN i.invoiceLineItems li "
                    + "where i.deleteFlag = 'false' and li.deleteFlag= 'false' "
                    + "and i.invoiceDate BETWEEN :startDate AND :endDate "
                    + "group by CONCAT(MONTH(i.invoiceDate),'-' , Year(i.invoiceDate))";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            invoices = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return invoices;
    }

    @Override
    public List<Object[]> getInvoiceDue(Date startDate, Date endDate) {
        List<Object[]> invoices = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "invoiceReferenceNumber, invoiceNotes, invoiceDate, invoiceDueOn "
                    + "from Invoice i "
                    + "where i.deleteFlag = 'false' "
                    + "and i.invoiceDate BETWEEN :startDate AND :endDate ";
            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            invoices = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return invoices;
    }

    @Override
    public List<Invoice> getInvoiceListByDueDate() {
        TypedQuery<Invoice> query = getEntityManager().createQuery("Select i from Invoice i where i.deleteFlag = false and i.invoiceDueDate =:invoiceDueDate", Invoice.class);
        query.setParameter("invoiceDueDate", LocalDateTime.now());
        List<Invoice> invoiceList = query.getResultList();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            return invoiceList;
        }
        return null;
    }

    @Override
    public List<Invoice> getInvoiceListByDueAmount() {
        TypedQuery<Invoice> query = getEntityManager().createQuery("Select i from Invoice i where i.deleteFlag = false and i.dueAmount !=:dueAmount", Invoice.class);
        query.setParameter("dueAmount", new BigDecimal(0.00));
        List<Invoice> invoiceList = query.getResultList();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            return invoiceList;
        }
        return null;
    }

    @Override
    public Invoice getClosestDueInvoiceByContactId(Integer contactId) {
        TypedQuery<Invoice> query = getEntityManager().createQuery("Select i from Invoice i where i.deleteFlag = false and i.dueAmount !=:dueAmount and i.invoiceContact.contactId =:contactId ORDER BY i.invoiceDueDate ASC", Invoice.class);
        query.setParameter("contactId", contactId);
        query.setParameter("dueAmount", new BigDecimal(0));
        List<Invoice> invoiceList = query.getResultList();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            return invoiceList.get(0);
        }
        return null;
    }

    @Override
    public List<InvoiceReportRestModel> getInvoicesForReports(String refNumber, Date invoiceStartDate, Date invoiceEndDate, Date invoiceDueStartDate, Date invoiceDueEndDate, Integer contactId, Integer pageNo, Integer pageSize) {
        StringBuilder queryBuilder = new StringBuilder();
        if (refNumber != null) {
            queryBuilder.append(" AND i.invoiceReferenceNumber = :invoiceReferenceNumber");
        }
        if (invoiceStartDate != null) {
            queryBuilder.append(" AND i.invoiceDate BETWEEN :invoiceStartDate and :invoiceEndDate");
        }
        if (invoiceDueStartDate != null) {
            queryBuilder.append(" AND i.invoiceDueDate BETWEEN :invoiceDueStartDate AND :invoiceDueEndDate");
        }
        if (contactId != null) {
            queryBuilder.append(" AND i.invoiceContact.id = :contactId");
        }
        TypedQuery<Invoice> query = getEntityManager().createQuery("SELECT i FROM Invoice i WHERE i.deleteFlag = false " + queryBuilder.toString() + " ORDER BY i.invoiceReferenceNumber ASC", Invoice.class);

        if (refNumber != null) {
            query.setParameter("invoiceReferenceNumber", refNumber);
        }
        if (invoiceStartDate != null) {
            query.setParameter("invoiceStartDate", Instant.ofEpochMilli(DateUtils.getStartDate(invoiceStartDate).getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
            query.setParameter("invoiceEndDate", Instant.ofEpochMilli(DateUtils.getEndDate(invoiceEndDate).getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        if (invoiceDueStartDate != null) {
            query.setParameter("invoiceDueStartDate", Instant.ofEpochMilli(DateUtils.getStartDate(invoiceStartDate).getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
            query.setParameter("invoiceDueEndDate", Instant.ofEpochMilli(DateUtils.getEndDate(invoiceDueEndDate).getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        if (contactId != null) {
            query.setParameter("contactId", contactId);
        }

        int maxRows = CommonUtil.DEFAULT_ROW_COUNT;
        if (pageSize != null) {
            maxRows = pageSize;
        }
        int start = 0;
        if (pageNo != null) {
            pageNo = pageNo * maxRows;
            start = pageNo;
        }
        query.setFirstResult(start);
        query.setMaxResults(maxRows);

        List<Invoice> invoiceList = query.getResultList();
        List<InvoiceReportRestModel> invoiceReportRestModelList = new ArrayList();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            for (Invoice invoice : invoiceList) {
                InvoiceReportRestModel invoiceReportRestModel = new InvoiceReportRestModel();
                invoiceReportRestModel.setInvoiceId(invoice.getInvoiceId());
                invoiceReportRestModel.setInvoiceDate(invoice.getInvoiceDate());
                invoiceReportRestModel.setInvoiceDueDate(invoice.getInvoiceDueDate());
                invoiceReportRestModel.setRefNumber(invoice.getInvoiceReferenceNumber());
                invoiceReportRestModel.setContactName(invoice.getInvoiceContact().getFirstName() + " " + invoice.getInvoiceContact().getLastName());
                invoiceReportRestModel.setStatus(InvoiceStatusConstant.getStatusName(invoice.getStatus()));
                invoiceReportRestModel.setNoOfItem(invoice.getInvoiceLineItems().size());
                invoiceReportRestModel.setTotalCost(invoice.getInvoiceAmount());
                invoiceReportRestModelList.add(invoiceReportRestModel);
            }
        }
        return invoiceReportRestModelList;
    }

    @Override
    public List<Invoice> getInvoiceList() {
        TypedQuery<Invoice> query = getEntityManager().createQuery("SELECT i FROM Invoice i WHERE i.deleteFlag = false  ORDER BY i.invoiceReferenceNumber ASC", Invoice.class);
        List<Invoice> invoiceList = query.getResultList();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            return invoiceList;
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteByIds(List<Integer> ids) {
        if (ids != null && !ids.isEmpty()) {
            for (Integer id : ids) {
                Invoice invoice = findByPK(id);
                invoice.setDeleteFlag(Boolean.TRUE);
                update(invoice);
            }
        }
    }
}
