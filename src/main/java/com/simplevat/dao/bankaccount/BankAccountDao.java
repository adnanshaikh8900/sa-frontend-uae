package com.simplevat.dao.bankaccount;

import java.util.List;
import java.util.Map;

import com.simplevat.constant.dbfilter.BankAccounrFilterEnum;
import com.simplevat.dao.Dao;
import com.simplevat.entity.bankaccount.BankAccount;

public interface BankAccountDao extends Dao<Integer, BankAccount> {

    List<BankAccount> getBankAccounts();

    List<BankAccount> getBankAccountByUser(int userId);

    BankAccount getBankAccountById(int id);

    void deleteByIds(List<Integer> ids);

	public List<BankAccount> getBankAccounts(Map<BankAccounrFilterEnum, Object> filterDataMap);
}
