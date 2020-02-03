package com.simplevat.service;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.BankAccounrFilterEnum;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.rest.PaginationModel;
import com.simplevat.service.SimpleVatService;

public abstract class BankAccountService extends SimpleVatService<Integer, BankAccount> {

	public abstract List<BankAccount> getBankAccounts();

	public abstract List<BankAccount> getBankAccountByUser(int userId);

	public abstract BankAccount getBankAccountById(int id);

	public abstract void deleteByIds(List<Integer> ids);

	public abstract List<BankAccount> getBankAccounts(Map<BankAccounrFilterEnum, Object> filterDataMap,
			PaginationModel paginationModel);
}
