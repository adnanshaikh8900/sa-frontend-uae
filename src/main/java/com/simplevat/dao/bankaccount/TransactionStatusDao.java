package com.simplevat.dao.bankaccount;

import java.util.List;

import com.simplevat.entity.bankaccount.TransactionStatus;
import com.simplevat.dao.Dao;

public interface TransactionStatusDao  extends Dao<Integer, TransactionStatus> {

	public List<TransactionStatus> findAllTransactionStatues();

	public List<TransactionStatus> findAllTransactionStatuesByTrnxId(Integer transactionId);
}
