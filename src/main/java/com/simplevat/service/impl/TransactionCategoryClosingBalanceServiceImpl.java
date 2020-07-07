package com.simplevat.service.impl;

import com.simplevat.constant.dbfilter.TransactionCategoryBalanceFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.dao.TransactionCategoryClosingBalanceDao;
import com.simplevat.entity.TransactionCategoryBalance;
import com.simplevat.entity.TransactionCategoryClosingBalance;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.TransactionCategoryClosingBalanceService;
import com.simplevat.utils.DateFormatUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TransactionCategoryClosingBalanceServiceImpl extends TransactionCategoryClosingBalanceService {

    @Autowired
    private TransactionCategoryClosingBalanceDao transactionCategoryClosingBalanceDao;

    @Autowired
    private DateFormatUtil dateFormatUtil;

    @Override
    protected Dao<Integer, TransactionCategoryClosingBalance> getDao() {
        return transactionCategoryClosingBalanceDao;
    }

    @Override
    public PaginationResponseModel getAll(Map<TransactionCategoryBalanceFilterEnum, Object> filterMap) {
        return transactionCategoryClosingBalanceDao.getAll(filterMap);
    }

    @Override
    // TODO Remain for update completed create and delete
    // TODO Need to split this method as get amount and update TransactionCategoryBalance
    public synchronized BigDecimal updateClosingBalance(Transaction transaction) {
        List<TransactionCategoryClosingBalance> balanceList = new ArrayList<>();
        if (transaction != null) {
            TransactionCategory category = transaction.getBankAccount().getTransactionCategory();
            boolean isUpdateOpeningBalance=false;
            boolean isDebit = transaction.getDebitCreditFlag().equals('D')
                    ? Boolean.TRUE
                    : Boolean.FALSE;
            BigDecimal transactionAmount = transaction.getTransactionAmount();

            Map<String, Object> param = new HashMap<>();
            param.put("transactionCategory", category);
            param.put("closingBalanceDate", transaction.getTransactionDate());

            TransactionCategoryClosingBalance balance = getFirstElement(findByAttributes(param));
            BigDecimal closingBalance = BigDecimal.ZERO;
            if (balance == null) {
                param = new HashMap<>();
                param.put("transactionCategory", category);
                TransactionCategoryClosingBalance lastBalance = getLastElement(findByAttributes(param));
                if(lastBalance == null) {
                    balance = new TransactionCategoryClosingBalance();
                    balance.setTransactionCategory(category);
                    balance.setCreatedBy(transaction.getCreatedBy());
                    balance.setOpeningBalance(BigDecimal.ZERO);
                    balance.setEffectiveDate(new Date());
                    balance.setClosingBalanceDate(transaction.getTransactionDate());
                    balanceList.add(balance);
                }
                else
                {
                    balance = new TransactionCategoryClosingBalance();
                    balance.setTransactionCategory(lastBalance.getTransactionCategory());
                    balance.setCreatedBy(transaction.getCreatedBy());
                    balance.setOpeningBalance(lastBalance.getClosingBalance());
                    balance.setEffectiveDate(new Date());
                    balance.setClosingBalanceDate(transaction.getTransactionDate());
                    balance.setClosingBalance(lastBalance.getClosingBalance());
                    balanceList.add(balance);
                    List<TransactionCategoryClosingBalance> upperbalanceList = transactionCategoryClosingBalanceDao.
                            getClosingBalanceGreaterThanCurrentDate(balance.getClosingBalanceDate(),balance.getTransactionCategory());
                    if(upperbalanceList.size() > 0) {
                        balanceList.addAll(upperbalanceList);
                        isUpdateOpeningBalance = true;
                    }
                }
            }
            else
            {
                param = new HashMap<>();
                param.put("transactionCategory", category);
                closingBalance = balance.getClosingBalance();
                TransactionCategoryClosingBalance lastBalance = transactionCategoryClosingBalanceDao.getLastClosingBalanceByDate(category); //getLastElement(findByAttributes(param));
                if(lastBalance!=null && lastBalance.getClosingBalance() != balance.getClosingBalance() &&
                !(lastBalance.getClosingBalanceDate().isEqual(balance.getClosingBalanceDate())))
                {
                    isUpdateOpeningBalance = true;
                    balanceList = transactionCategoryClosingBalanceDao.
                            getClosingBalanceForTimeRange(balance.getClosingBalanceDate(),lastBalance.getClosingBalanceDate()
                                    ,balance.getTransactionCategory());
                }
                else
                    balanceList.add(balance);
            }
            boolean firstTransaction = true;
            for(TransactionCategoryClosingBalance transactionCategoryClosingBalance : balanceList) {
                closingBalance = transactionCategoryClosingBalance.getClosingBalance();
                if (isDebit) {
                    closingBalance = closingBalance
                            .subtract(transactionAmount);
                } else {
                    closingBalance = closingBalance
                            .add(transactionAmount);
                }
                if(isUpdateOpeningBalance &&!firstTransaction){
                    BigDecimal openingBalance = transactionCategoryClosingBalance.getOpeningBalance();
                    if (isDebit) {
                        openingBalance = openingBalance
                                .subtract(transactionAmount);
                    } else {
                        openingBalance = openingBalance
                                .add(transactionAmount);
                    }
                    transactionCategoryClosingBalance.setOpeningBalance(openingBalance);
                }
                firstTransaction= false;
                transactionCategoryClosingBalance.setClosingBalance(closingBalance);
                transactionCategoryClosingBalanceDao.update(transactionCategoryClosingBalance);
            }
            return balance.getClosingBalance();
        }
        return null;
    }

    public void addNewClosingBalance(TransactionCategoryBalance openingBalance)
    {
        TransactionCategoryClosingBalance balance = new TransactionCategoryClosingBalance();
        balance.setTransactionCategory(openingBalance.getTransactionCategory());
        balance.setCreatedBy(openingBalance.getCreatedBy());
        balance.setOpeningBalance(openingBalance.getOpeningBalance());
        balance.setClosingBalance(openingBalance.getRunningBalance());
        balance.setEffectiveDate(openingBalance.getEffectiveDate());
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(openingBalance.getEffectiveDate());
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.HOUR,0);
        calendar.set(Calendar.SECOND,0);
        balance.setClosingBalanceDate(dateFormatUtil.getDateStrAsLocalDateTime(dateFormatUtil.getDateAsString(calendar.getTime(),"dd/MM/yyyy"),
                "dd/MM/yyyy"));
        persist(balance);
    }

    @Override
    public BigDecimal matchClosingBalanceForReconcile(LocalDateTime reconcileDate, TransactionCategory category) {
        TransactionCategoryClosingBalance transactionCategoryClosingBalance = transactionCategoryClosingBalanceDao.
                getClosingBalanceLessThanCurrentDate(reconcileDate,category);
        if(transactionCategoryClosingBalance !=null)
            return transactionCategoryClosingBalance.getClosingBalance();
        return BigDecimal.ZERO;
    }
}
