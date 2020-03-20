package com.simplevat.service.impl.bankaccount;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.constant.dbfilter.BankAccounrFilterEnum;
import com.simplevat.dao.bankaccount.BankAccountDao;
import com.simplevat.dao.bankaccount.TransactionDao;
import com.simplevat.entity.Activity;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.model.ChartData;
import com.simplevat.model.DashBoardBankDataModel;
import com.simplevat.rest.PaginationModel;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.BankAccountService;
import com.simplevat.util.ChartUtil;
import com.simplevat.utils.DateFormatUtil;
import com.simplevat.utils.DateUtils;

import org.apache.commons.lang3.StringUtils;

@Service("bankAccountService")
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public class BankAccountServiceImpl extends BankAccountService {

	private static final String BANK_ACCOUNT = "BANK_ACCOUNT";

	@Autowired
	public BankAccountDao bankAccountDao;

	@Autowired
	private TransactionDao transactionDao;

	@Autowired
	private DateUtils dateUtil;

	@Autowired
	private DateFormatUtil dateFormatUtil;

	@Override
	public List<BankAccount> getBankAccounts() {
		return getDao().getBankAccounts();
	}

	@Override
	public List<BankAccount> getBankAccountByUser(int userId) {
		return bankAccountDao.getBankAccountByUser(userId);
	}

	@Override
	protected BankAccountDao getDao() {
		return this.bankAccountDao;
	}

	public void persist(BankAccount bankAccount) {
		super.persist(bankAccount, null, getActivity(bankAccount, "CREATED"));
	}

	public BankAccount update(BankAccount bankAccount) {
		return super.update(bankAccount, null, getActivity(bankAccount, "UPDATED"));
	}

	private Activity getActivity(BankAccount bankAccount, String activityCode) {
		Activity activity = new Activity();
		activity.setActivityCode(activityCode);
		activity.setModuleCode(BANK_ACCOUNT);
		activity.setField3("Bank Account " + activityCode.charAt(0)
				+ activityCode.substring(1, activityCode.length()).toLowerCase());
		activity.setField1(bankAccount.getAccountNumber());
		activity.setField2(bankAccount.getBankName());
		activity.setLastUpdateDate(LocalDateTime.now());
		activity.setLoggingRequired(true);
		return activity;
	}

	@Override
	public BankAccount getBankAccountById(int id) {
		return bankAccountDao.getBankAccountById(id);
	}

	@Override
	public void deleteByIds(List<Integer> ids) {
		bankAccountDao.deleteByIds(ids);
	}

	@Override
	public PaginationResponseModel getBankAccounts(Map<BankAccounrFilterEnum, Object> filterDataMap,
			PaginationModel paginationModel) {
		return bankAccountDao.getBankAccounts(filterDataMap, paginationModel);
	}

	@Override
	public DashBoardBankDataModel getBankBalanceList(BankAccount bank, Map<Object, Number> inflow,
			Map<Object, Number> outFlow) {
		List<Number> number = new ArrayList<Number>();
		List<String> months = new ArrayList<String>();
		for (Object key : inflow.keySet()) {
			number.add((inflow.get(key).doubleValue() - outFlow.get(key).doubleValue()));
			months.add((String) key);
		}
		DashBoardBankDataModel model = new DashBoardBankDataModel();
		model.setData(number);
		model.setBalance(bank.getCurrentBalance());
		model.setUpdatedDate(bank.getLastUpdateDate() != null
				? dateFormatUtil.getDateAsString(bank.getLastUpdateDate(), "dd/MM/yyyy")
				: null);
		model.setLabels(months);
		model.setAccount_name(bank.getBankAccountName());
		return model;

	}
}
