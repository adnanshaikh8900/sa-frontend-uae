package com.simplevat.service.bankaccount;

import java.util.List;
import java.util.Map;

import com.simplevat.criteria.bankaccount.TransactionCriteria;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import com.simplevat.entity.bankaccount.TransactionView;
import com.simplevat.service.SimpleVatService;
import java.util.Date;

public abstract class TransactionService extends SimpleVatService<Integer, Transaction> {

    public abstract List<Transaction> getTransactionsByCriteria(
            TransactionCriteria transactionCriteria) throws Exception;

    public abstract Transaction updateOrCreateTransaction(Transaction transaction);

    public abstract Map<Object, Number> getCashOutData();

    public abstract Map<Object, Number> getCashInData();

    public abstract int getMaxTransactionValue(Map<Object, Number> cashInMap, Map<Object, Number> cashOutMap);

    public abstract void persist(Transaction transaction);

    public abstract Transaction update(Transaction transaction);

    public abstract Transaction deleteTransaction(Transaction transaction);

    public abstract Transaction deleteChildTransaction(Transaction transaction);

    public abstract List<Transaction> getTransactionsByDateRangeAndTranscationTypeAndTranscationCategory(TransactionType transactionType, TransactionCategory category, Date startDate, Date lastDate);

    public abstract List<Transaction> getChildTransactionListByParentId(int parentId);

    public abstract void persistChildTransaction(Transaction transaction);

    public abstract List<Transaction> getAllTransactionsByRefId(int transactionRefType, int transactionRefId);

    public abstract List<Transaction> getAllParentTransactions(BankAccount bankAccount);

    public abstract List<TransactionView> getAllTransactionViewList(Integer bankAccountId);

    public abstract List<Transaction> getAllTransactionListByBankAccountId(Integer bankAccountId);

    public abstract List<Transaction> getAllTransactions();

    public abstract List<TransactionView> getChildTransactionViewListByParentId(Integer parentTransaction);

    public abstract Integer getTotalTransactionCountByBankAccountIdForLazyModel(Integer bankAccountId, Integer transactionStatus);

    public abstract Integer getTotalExplainedTransactionCountByBankAccountId(Integer bankAccountId);

    public abstract Integer getTotalUnexplainedTransactionCountByBankAccountId(Integer bankAccountId);

    public abstract Integer getTotalPartiallyExplainedTransactionCountByBankAccountId(Integer bankAccountId);

    public abstract Integer getTotalAllTransactionCountByBankAccountId(Integer bankAccountId);

    public abstract List<TransactionView> getTransactionViewListByDateRang(Integer bankAccountId, Date startDate, Date endDate);

    public abstract Integer getTransactionCountByRangeAndBankAccountId(int pageSize, Integer bankAccountId, int rowCount);

    public abstract List<TransactionView> getTransactionViewList(int pageSize, Integer bankAccountId, int rowCount, Integer transactionStatus, Map<String, Object> filters,String sortField, String sortOrder);

    public abstract List<Transaction> getParentTransactionListByRangeAndBankAccountId(int pageSize, Integer bankAccountId, int rowCount, Integer transactionStatus,Map<String, Object> filters,String sortField, String sortOrder);
}
