package com.simplevat.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.simplevat.entity.bankaccount.TransactionCategory;

import lombok.Data;

@Entity
@Table(name = "COAC_TRANSACTION_CATEGORY")
@Data
@NamedQueries({
		@NamedQuery(name = "findCoacTransactionCategoryForTransctionCategortyId", query = "SELECT tc FROM CoacTransactionCategory tc where tc.transactionCategory.transactionCategoryId=:id ") })
public class CoacTransactionCategory {
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
