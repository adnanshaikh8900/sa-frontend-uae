package com.simplevat.dao.impl.bankaccount;

import com.simplevat.constant.TransactionStatusConstant;
import com.simplevat.contact.model.TransactionReportRestModel;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Query;
import javax.persistence.TemporalType;

import org.springframework.stereotype.Repository;

import com.simplevat.dao.AbstractDao;
import com.simplevat.dao.bankaccount.TransactionDao;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionView;
import com.simplevat.utils.CommonUtil;
import com.simplevat.utils.DateUtils;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;
import javax.persistence.TypedQuery;

@Repository
public class TransactionDaoImpl extends AbstractDao<Integer, Transaction> implements TransactionDao {

	@Override
	public Transaction updateOrCreateTransaction(Transaction transaction) {
		return this.update(transaction);
	}

	@Override
	public List<Object[]> getCashInData(Date startDate, Date endDate) {
		List<Object[]> cashInData = new ArrayList<>(0);
		try {
			String queryString = "select "
					+ "sum(transactionAmount) as total, CONCAT(MONTH(transactionDate),'-' , Year(transactionDate)) as month "
					+ "from Transaction "
					+ "where debitCreditFlag = 'c' and transactionDate BETWEEN :startDate AND :endDate "
					+ "group by CONCAT(MONTH(transactionDate),'-' , Year(transactionDate))";

			Query query = getEntityManager().createQuery(queryString)
					.setParameter("startDate", startDate, TemporalType.DATE)
					.setParameter("endDate", endDate, TemporalType.DATE);
			cashInData = query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cashInData;
	}

	@Override
	public List<Object[]> getCashOutData(Date startDate, Date endDate) {
		List<Object[]> cashOutData = new ArrayList<>(0);
		try {
			String queryString = "select "
					+ "sum(transactionAmount) as total, CONCAT(MONTH(transactionDate),'-' , Year(transactionDate)) as month "
					+ "from Transaction "
					+ "where debitCreditFlag = 'd' and transactionDate BETWEEN :startDate AND :endDate "
					+ "group by CONCAT(MONTH(transactionDate),'-' , Year(transactionDate))";
			Query query = getEntityManager().createQuery(queryString)
					.setParameter("startDate", startDate, TemporalType.DATE)
					.setParameter("endDate", endDate, TemporalType.DATE);
			cashOutData = query.getResultList();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cashOutData;
	}

	@Override
	public Transaction getBeforeTransaction(Transaction transaction) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.transactionDate <= :transactionDate and t.transactionId < :transactionId and t.deleteFlag = false and t.bankAccount.bankAccountId = :bankAccountId ORDER BY t.transactionDate DESC",
				Transaction.class);
		query.setParameter("transactionDate", transaction.getTransactionDate());
		query.setParameter("bankAccountId", transaction.getBankAccount().getBankAccountId());
		query.setParameter("transactionId", transaction.getTransactionId());
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList.get(transactionList.size() - 1);
		}
		return null;
	}

	@Override
	public List<Transaction> getAfterTransaction(Transaction transaction) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.transactionDate > :transactionDate and t.deleteFlag = false and t.bankAccount.bankAccountId = :bankAccountId ORDER BY t.transactionDate ASC",
				Transaction.class);
		query.setParameter("transactionDate", transaction.getTransactionDate());
		query.setParameter("bankAccountId", transaction.getBankAccount().getBankAccountId());
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<TransactionReportRestModel> getTransactionsReport(Integer transactionTypeId,
			Integer transactionCategoryId, Date startDate, Date endDate, Integer bankAccountId, Integer pageNo,
			Integer pageSize) {

		StringBuilder builder = new StringBuilder();
		if (transactionTypeId != null) {
			builder.append("and t.transactionType.transactionTypeCode =:transactionTypeCode ");
		}
		if (transactionCategoryId != null) {
			builder.append("and t.explainedTransactionCategory.transactionCategoryId =:transactionCategoryId ");
		}
		if (startDate != null && endDate != null) {
			builder.append("and t.transactionDate BETWEEN :startDate AND :lastDate ");
		}
		TypedQuery<Transaction> query = getEntityManager()
				.createQuery("SELECT t FROM Transaction t WHERE t.deleteFlag = false " + builder.toString()
						+ "ORDER BY t.transactionDate ASC", Transaction.class);
		if (transactionTypeId != null) {
			query.setParameter("transactionTypeCode", transactionTypeId);
		}
		if (transactionCategoryId != null) {
			query.setParameter("transactionCategoryId", transactionCategoryId);
		}
		if (startDate != null && endDate != null) {
			query.setParameter("startDate", Instant.ofEpochMilli(DateUtils.getStartDate(startDate).getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime());
			query.setParameter("lastDate", Instant.ofEpochMilli(DateUtils.getEndDate(endDate).getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime());
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
		List<TransactionReportRestModel> transactionReportRestModelList = new ArrayList();
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			for (Transaction transaction : transactionList) {
				TransactionReportRestModel transactionReportRestModel = new TransactionReportRestModel();
				if (transaction.getBankAccount() != null) {
					transactionReportRestModel.setBankAccount(transaction.getBankAccount().getBankAccountName());
				}
				transactionReportRestModel.setTransactionAmount(transaction.getTransactionAmount());
				if (transaction.getExplainedTransactionCategory() != null) {
					transactionReportRestModel.setTransactionCategory(
							transaction.getExplainedTransactionCategory().getTransactionCategoryName());
				}
				transactionReportRestModel.setTransactionDate(transaction.getTransactionDate());
				transactionReportRestModel.setTransactionDescription(transaction.getTransactionDescription());
				transactionReportRestModel.setTransactionId(transaction.getTransactionId());
				if (transaction.getTransactionType() != null) {
					transactionReportRestModel
							.setTransactionType(transaction.getTransactionType().getTransactionTypeName());
				}
				transactionReportRestModelList.add(transactionReportRestModel);
			}
		}
		return transactionReportRestModelList;
	}

	@Override
	public List<Transaction> getTransactionsByDateRangeAndBankAccountId(BankAccount bankAccount, Date startDate,
			Date lastDate) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false and t.bankAccount.bankAccountId = :bankAccountId and t.transactionDate BETWEEN :startDate AND :lastDate ORDER BY t.transactionDate ASC",
				Transaction.class);
		query.setParameter("bankAccountId", bankAccount.getBankAccountId());
		query.setParameter("startDate",
				Instant.ofEpochMilli(startDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
		query.setParameter("lastDate",
				Instant.ofEpochMilli(lastDate.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<Transaction> getChildTransactionListByParentId(int parentId) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false and t.parentTransaction.transactionId =:parentId ORDER BY t.transactionDate ASC",
				Transaction.class);
		query.setParameter("parentId", parentId);
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<Transaction> getAllTransactionsByRefId(int transactionRefType, int transactionRefId) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false and t.referenceType = :referenceType and t.referenceId = :referenceId ORDER BY t.transactionDate ASC",
				Transaction.class);
		query.setParameter("referenceType", transactionRefType);
		query.setParameter("referenceId", transactionRefId);
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<Transaction> getAllParentTransactions(BankAccount bankAccount) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false and t.parentTransaction = null and t.bankAccount.bankAccountId = :bankAccountId ORDER BY t.transactionDate DESC",
				Transaction.class);
		query.setParameter("bankAccountId", bankAccount.getBankAccountId());
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<Transaction> getAllTransactionListByBankAccountId(Integer bankAccountId) {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false AND t.bankAccount.bankAccountId =:bankAccountId ORDER BY t.transactionDate ASC",
				Transaction.class);
		query.setParameter("bankAccountId", bankAccountId);
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<Transaction> getAllTransactions() {
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.deleteFlag = false ORDER BY t.transactionDate ASC",
				Transaction.class);
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<TransactionView> getAllTransactionViewList(Integer bankAccountId) {
		TypedQuery<TransactionView> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionView t WHERE t.bankAccountId =:bankAccountId ORDER BY t.transactionDate DESC",
				TransactionView.class);
		query.setParameter("bankAccountId", bankAccountId);
		List<TransactionView> transactionViewList = query.getResultList();
		if (transactionViewList != null && !transactionViewList.isEmpty()) {
			return transactionViewList;
		}
		return null;
	}

	@Override
	public List<TransactionView> getChildTransactionViewListByParentId(Integer parentTransaction) {
		TypedQuery<TransactionView> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionView t WHERE t.parentTransaction =:parentTransaction ORDER BY t.transactionDate ASC",
				TransactionView.class);
		query.setParameter("parentTransaction", parentTransaction);
		List<TransactionView> transactionViewList = query.getResultList();
		if (transactionViewList != null && !transactionViewList.isEmpty()) {
			return transactionViewList;
		}
		return null;
	}

	@Override
	public List<TransactionView> getTransactionViewList(int pageSize, Integer bankAccountId, int rowCount,
			Integer transactionStatus, Map<String, Object> filters, String sortField, String sortOrder) {
		System.out.println("sortOrder==" + sortOrder);
		StringBuilder builder = new StringBuilder("");
		StringBuilder filterBuilder = new StringBuilder("");
		for (String filedName : filters.keySet()) {
			Object filterValue = filters.get(filedName);
			if (filterValue != null && !((String) filterValue).isEmpty()) {
				filterBuilder.append(" And ").append(filedName).append(" like '%").append((String) filterValue)
						.append("%'");
			}
		}
		if (sortField != null) {
			filterBuilder.append(" order by ").append(sortField)
					.append(sortOrder.equalsIgnoreCase("ASCENDING") ? " ASC," : " DESC,");
		} else {
			filterBuilder.append(" order by ");
		}
		if (transactionStatus != null) {
			builder.append(" AND t.explanationStatusCode = ").append(transactionStatus);
		}
		TypedQuery<TransactionView> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionView t WHERE t.bankAccountId =:bankAccountId AND t.parentTransaction = null"
						+ builder.toString() + filterBuilder.toString()
						+ "  t.transactionDate DESC, t.transactionId DESC",
				TransactionView.class);
		query.setParameter("bankAccountId", bankAccountId);
		query.setFirstResult(pageSize);
		query.setMaxResults(rowCount);
		List<TransactionView> transactionViewList = query.getResultList();
		if (transactionViewList != null && !transactionViewList.isEmpty()) {
			return transactionViewList;
		}
		return null;
	}

	@Override
	public Integer getTotalTransactionCountByBankAccountIdForLazyModel(Integer bankAccountId,
			Integer transactionStatus) {
		StringBuilder builder = new StringBuilder("");
		if (transactionStatus != null) {
			builder.append(" AND t.explanationStatusCode = ").append(transactionStatus);
		}
		Query query = getEntityManager().createQuery(
				"SELECT COUNT(t) FROM TransactionView t WHERE t.parentTransaction = null AND t.bankAccountId =:bankAccountId"
						+ builder.toString());
		query.setParameter("bankAccountId", bankAccountId);
		List<Object> countList = query.getResultList();
		if (countList != null && !countList.isEmpty()) {
			return ((Long) countList.get(0)).intValue();
		}
		return null;
	}

	@Override
	public Integer getTotalExplainedTransactionCountByBankAccountId(Integer bankAccountId) {
		Query query = getEntityManager().createQuery(
				"SELECT COUNT(t) FROM TransactionView t WHERE t.parentTransaction = null AND t.bankAccountId =:bankAccountId AND t.explanationStatusCode =:explanationStatusCode");
		query.setParameter("bankAccountId", bankAccountId);
		query.setParameter("explanationStatusCode", TransactionStatusConstant.EXPLIANED);
		List<Object> countList = query.getResultList();
		if (countList != null && !countList.isEmpty()) {
			return ((Long) countList.get(0)).intValue();
		}
		return null;
	}

	@Override
	public Integer getTotalUnexplainedTransactionCountByBankAccountId(Integer bankAccountId) {
		Query query = getEntityManager().createQuery(
				"SELECT COUNT(t) FROM TransactionView t WHERE t.parentTransaction = null AND t.bankAccountId =:bankAccountId AND t.explanationStatusCode =:explanationStatusCode");
		query.setParameter("bankAccountId", bankAccountId);
		query.setParameter("explanationStatusCode", TransactionStatusConstant.UNEXPLAINED);
		List<Object> countList = query.getResultList();
		if (countList != null && !countList.isEmpty()) {
			return ((Long) countList.get(0)).intValue();
		}
		return null;
	}

	@Override
	public Integer getTotalPartiallyExplainedTransactionCountByBankAccountId(Integer bankAccountId) {
		Query query = getEntityManager().createQuery(
				"SELECT COUNT(t) FROM TransactionView t WHERE t.parentTransaction = null AND t.bankAccountId =:bankAccountId AND t.explanationStatusCode =:explanationStatusCode");
		query.setParameter("bankAccountId", bankAccountId);
		query.setParameter("explanationStatusCode", TransactionStatusConstant.PARTIALLYEXPLIANED);
		List<Object> countList = query.getResultList();
		if (countList != null && !countList.isEmpty()) {
			return ((Long) countList.get(0)).intValue();
		}
		return null;
	}

	@Override
	public Integer getTotalAllTransactionCountByBankAccountId(Integer bankAccountId) {
		Query query = getEntityManager().createQuery(
				"SELECT COUNT(t) FROM TransactionView t WHERE t.parentTransaction = null AND t.bankAccountId =:bankAccountId");
		query.setParameter("bankAccountId", bankAccountId);
		List<Object> countList = query.getResultList();
		if (countList != null && !countList.isEmpty()) {
			return ((Long) countList.get(0)).intValue();
		}
		return null;
	}

	@Override
	public Integer getTransactionCountByRangeAndBankAccountId(int pageSize, Integer bankAccountId, int rowCount) {
		TypedQuery<TransactionView> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionView t WHERE t.bankAccountId =:bankAccountId AND t.parentTransaction = null ORDER BY t.transactionDate DESC",
				TransactionView.class);
		query.setParameter("bankAccountId", bankAccountId);
		query.setFirstResult(pageSize);
		query.setMaxResults(rowCount);
		List<TransactionView> transactionViewList = query.getResultList();
		if (transactionViewList != null && !transactionViewList.isEmpty()) {
			return transactionViewList.size();
		}
		return null;
	}

	@Override
	public List<Transaction> getParentTransactionListByRangeAndBankAccountId(int pageSize, Integer bankAccountId,
			int rowCount, Integer transactionStatus, Map<String, Object> filters, String sortField, String sortOrder) {
		System.out.println("sortOrder==" + sortOrder);
		StringBuilder builder = new StringBuilder("");
		StringBuilder filterBuilder = new StringBuilder("");
		if (transactionStatus != null) {
			builder.append(" AND t.transactionStatus.explainationStatusCode = ").append(transactionStatus);
		}
		// sql.append(" and ").append(entry.getKey()).append(" like
		// '%").append(value).append("%'");
		for (String filedName : filters.keySet()) {
			Object filterValue = filters.get(filedName);
			if (filterValue != null && !((String) filterValue).isEmpty()) {
				filterBuilder.append(" And ").append(filedName).append(" like '%").append((String) filterValue)
						.append("%'");
			}
		}
		if (sortField != null) {
			filterBuilder.append(" order by ").append(sortField)
					.append(sortOrder.equalsIgnoreCase("ASCENDING") ? " ASC," : " DESC,");
		} else {
			filterBuilder.append(" order by ");
		}
		TypedQuery<Transaction> query = getEntityManager().createQuery(
				"SELECT t FROM Transaction t WHERE t.bankAccount.bankAccountId =:bankAccountId AND t.parentTransaction IS NULL"
						+ builder.toString() + filterBuilder.toString() + "  t.transactionDate DESC",
				Transaction.class);
		query.setParameter("bankAccountId", bankAccountId);
		query.setFirstResult(pageSize);
		query.setMaxResults(rowCount);
		List<Transaction> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public List<TransactionView> getTransactionViewListByDateRang(Integer bankAccountId, Date startDate, Date endDate) {
		TypedQuery<TransactionView> query = getEntityManager().createQuery(
				"SELECT t FROM TransactionView t WHERE t.bankAccountId =:bankAccountId AND t.parentTransaction = null AND t.transactionDate >=:startDate AND t.transactionDate <=:endDate ORDER BY t.transactionDate DESC, t.transactionId DESC",
				TransactionView.class);
		query.setParameter("bankAccountId", bankAccountId);
		query.setParameter("startDate", startDate, TemporalType.TIMESTAMP);
		query.setParameter("endDate", endDate, TemporalType.TIMESTAMP);
		List<TransactionView> transactionList = query.getResultList();
		if (transactionList != null && !transactionList.isEmpty()) {
			return transactionList;
		}
		return null;
	}

	@Override
	public Transaction getCurrentBalanceByBankId(Integer bankId) {
		List<Transaction> transactions = getEntityManager().createNamedQuery("getByBankId").setParameter("id", bankId)
				.setMaxResults(1).getResultList();
		return transactions != null ? transactions.get(0) : null;

	}

}
