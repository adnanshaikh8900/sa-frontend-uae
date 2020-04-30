package com.simplevat.entity.bankaccount;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.TableGenerator;
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.simplevat.constant.TransactionCreationMode;
import com.simplevat.constant.TransactionExplinationStatusEnum;
import com.simplevat.entity.Contact;
import com.simplevat.entity.Employee;
import com.simplevat.entity.Project;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

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
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLANATION_STATUS_CODE")
	private List<TransactionStatus> transactionStatus;

	@Basic(optional = false)
	@Column(name = "CURRENT_BALANCE")
	@ColumnDefault(value = "0.00")
	private BigDecimal currentBalance;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLINTION_BANK_ACCOUNT_ID")
	private BankAccount explinationBankAccount;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLINTION_VENDOR_CONTACT_ID")
	private Contact explinationVendor;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLINTION_CUSTOMER_CONTACT_ID")
	private Contact explinationCustomer;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EXPLINTION_EMPLOYEE_ID")
	private Employee explinationEmployee;

	@Basic
	@Column(name = "TRANSACTIN_CREATION_MODE", columnDefinition = "varchar(32) default 'MANUAL'")
	@Enumerated(EnumType.STRING)
	private TransactionCreationMode creationMode;

	@Column(name = "TRANSACTIN_EXPLINATION_STATUS", columnDefinition = "varchar(32) default 'NOT_EXPLAIN'")
	@Enumerated(EnumType.STRING)
	private TransactionExplinationStatusEnum transactionExplinationStatusEnum;

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
