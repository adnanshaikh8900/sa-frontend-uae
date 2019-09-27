package com.simplevat.dao.impl.bankaccount;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.simplevat.dao.bankaccount.BankAccountStatusDao;
import com.simplevat.entity.bankaccount.BankAccountStatus;

@Repository
@Transactional
public class BankAccountStatusDaoImpl implements BankAccountStatusDao{

	@PersistenceContext
	private EntityManager entityManager;
	
	@Override
	public List<BankAccountStatus> getBankAccountStatuses() {
		List<BankAccountStatus> bankAccountStatuses = entityManager.createNamedQuery("allBankAccountStatuses",
				BankAccountStatus.class).getResultList();
		return bankAccountStatuses;
	}

	@Override
	public BankAccountStatus getBankAccountStatus(Integer id) {
		return entityManager.find(BankAccountStatus.class, id);
	}

	@Override
	public BankAccountStatus getBankAccountStatusByName(String status) {
		
		BankAccountStatus bankAccounStatus = entityManager
                .createNamedQuery("findBankAccountStatusByName", BankAccountStatus.class)
                .setParameter("status", status)
                .getResultList().get(0);
		return bankAccounStatus;
	}

}
