package com.simplevat.dao.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TemporalType;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.ExpenseDao;
import com.simplevat.entity.Expense;
import com.simplevat.entity.invoice.Invoice;
import java.time.Instant;
import java.time.ZoneId;
import javax.persistence.TypedQuery;

@Repository
@Transactional
public class ExpenseDaoImpl extends AbstractDao<Integer, Expense> implements ExpenseDao {

    @Override
    public List<Expense> getAllExpenses() {
        List<Expense> expenses = this.executeNamedQuery("allExpenses");
        return expenses;
    }

    @Override
    public List<Object[]> getExpensePerMonth(Date startDate, Date endDate) {
        List<Object[]> expenses = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "sum(e.expenseAmount) as expenseTotal, "
                    + "CONCAT(MONTH(e.expenseDate),'-' , Year(e.expenseDate)) as month "
                    + "from Expense e "
                    + "where e.deleteFlag = 'false' "
                    + "and e.expenseDate BETWEEN :startDate AND :endDate "
                    + "group by CONCAT(MONTH(e.expenseDate),'-' , Year(e.expenseDate))";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            expenses = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return expenses;
    }

    @Override
    public List<Object[]> getExpenses(Date startDate, Date endDate) {
        List<Object[]> expenses = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "e.expenseAmount as expense, e.expenseDate as date, "
                    + "e.receiptNumber as ref "
                    + "from Expense e "
                    + "where e.deleteFlag = 'false' "
                    + "and e.expenseDate BETWEEN :startDate AND :endDate "
                    + "order by e.expenseDate asc";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            expenses = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return expenses;
    }

    @Override
    public List<Object[]> getVatOutPerMonthWise(Date startDate, Date endDate) {
        List<Object[]> expenses = new ArrayList<>(0);
        try {
            String queryString = "select "
                    + "sum((li.expenseLineItemUnitPrice*li.expenseLineItemQuantity)*li.expenseLineItemVat/100) as vatOutTotal, "
                    + "CONCAT(MONTH(e.expenseDate),'-' , Year(e.expenseDate)) as month "
                    + "from Expense e JOIN e.expenseLineItems li "
                    + "where e.deleteFlag = 'false' and li.deleteFlag= 'false'"
                    + "and e.expenseDate BETWEEN :startDate AND :endDate "
                    + "group by CONCAT(MONTH(e.expenseDate),'-' , Year(e.expenseDate))";

            Query query = getEntityManager().createQuery(queryString)
                    .setParameter("startDate", startDate, TemporalType.DATE)
                    .setParameter("endDate", endDate, TemporalType.DATE);
            expenses = query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return expenses;
    }

    @Override
    public List<Expense> getExpenseForReports(Date startDate, Date endDate) {

        TypedQuery<Expense> query = getEntityManager().createQuery("SELECT i FROM Expense i WHERE i.deleteFlag = false AND i.expenseDate BETWEEN :startDate AND :endDate ORDER BY i.expenseDate ASC", Expense.class);
        query.setParameter("startDate", Instant.ofEpochMilli(startDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
        query.setParameter("endDate", Instant.ofEpochMilli(endDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
        if (query.getResultList() != null && !query.getResultList().isEmpty()) {
            return query.getResultList();
        }
        return null;
    }
}
