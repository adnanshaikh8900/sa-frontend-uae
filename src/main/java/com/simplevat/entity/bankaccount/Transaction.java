package com.simplevat.entity.bankaccount;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.simplevat.entity.Journal;
import com.simplevat.entity.Project;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

import javax.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@Entity
@Table(name = "TRANSACTON")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Data
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
@NamedQueries({
		@NamedQuery(name = "getByBankId", query = "from Transaction t where t.bankAccount.id = :id order by t.id desc") })
public class Transaction implements Serializable {

	private static final long serialVersionUID = 848122185643690684L;

	@Id
	@Column(name = "TRANSACTION_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
	private Integer transactionId;

	@Basic
	@Column(name = "TRANSACTION_DATE")
	private LocalDateTime transactionDate;

	@Basic
	@Column(name = "TRANSACTION_DESCRIPTION")
	private String transactionDescription;

	@Basic
	@Column(name = "TRANSACTION_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal transactionAmount;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "TRANSACTION_TYPE_CODE")
	private ChartOfAccount chartOfAccount;

	@Basic
	@Column(name = "RECEIPT_NUMBER")
	private String receiptNumber;

	@Basic(optional = false)
	@Column(name = "DEBIT_CREDIT_FLAG")
	private Character debitCreditFlag;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLAINED_PROJECT_ID")
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLAINED_TRANSACTION_CATEGORY_CODE")
	private TransactionCategory explainedTransactionCategory;

	@Basic
	@Column(name = "EXPLAINED_TRANSACTION_DESCRIPTION")
	private String explainedTransactionDescription;

	@Basic
	@Column(name = "EXPLAINED_TRANSACTION_ATTACHEMENT_DESCRIPTION")
	private String explainedTransactionAttachementDescription;

	@Basic(optional = true)
	@Lob
	@Column(name = "EXPLAINED_TRANSACTION_ATTACHEMENT")
	private byte[] explainedTransactionAttachement;

	@Basic
	@Column(name = "EXPLAINED_TRANSACTION_ATTACHEMENT_FILE_NAME")
	private String explainedTransactionAttachmentFileName;

	@Basic
	@Column(name = "EXPLAINED_TRANSACTION_ATTACHEMENT_PATH")
	private String explainedTransactionAttachmentPath;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ACCOUNT_ID")
	private BankAccount bankAccount;

	@Basic(optional = false)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLANATION_STATUS_CODE")
	private TransactionStatus transactionStatus;

	@Basic(optional = false)
	@Column(name = "CURRENT_BALANCE")
	@ColumnDefault(value = "0.00")
	private BigDecimal currentBalance;

	@OneToMany
	@JoinColumn(name = "RECONSILE_JOURNAL_ID")
	private List<Journal> reconsileJournalList;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdateBy;

	@Column(name = "LAST_UPDATE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean deleteFlag = Boolean.FALSE;

	@Column(name = "VERSION_NUMBER")
	@ColumnDefault(value = "1")
	@Basic(optional = false)
	@Version
	private Integer versionNumber;

	@Column(name = "ENTRY_TYPE")
	private Integer entryType;

	@Column(name = "REFERENCE_ID")
	private Integer referenceId;

	@Column(name = "REFERENCE_TYPE")
	private Integer referenceType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_TRANSACTION")
	private Transaction parentTransaction;

	@JsonIgnore
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "parentTransaction")
	private Collection<Transaction> childTransactionList;

	@PrePersist
	public void updateDates() {
		createdDate = LocalDateTime.now();
		lastUpdateDate = LocalDateTime.now();
	}

	@PreUpdate
	public void updateLastUpdatedDate() {
		lastUpdateDate = LocalDateTime.now();
	}

}
