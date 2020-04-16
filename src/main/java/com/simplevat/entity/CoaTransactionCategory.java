package com.simplevat.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.simplevat.entity.bankaccount.TransactionCategory;

import lombok.Data;

@Entity
@Table(name = "COA_TRANSACTION_CATEGORY")
@Data
public class CoaTransactionCategory {
	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "TRANSACTION_CATEGORY_ID")
	private TransactionCategory transactionCategory;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_OF_ACCOUNT_CATEGORY_ID ")
	private ChartOfAccountCategory chartOfAccountCategory;
	


}
