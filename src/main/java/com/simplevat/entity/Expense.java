package com.simplevat.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.simplevat.constant.PayMode;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

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
import javax.persistence.TableGenerator;
import javax.persistence.Basic;
import javax.persistence.Convert;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.OneToOne;
import javax.persistence.Version;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({ @NamedQuery(name = "allExpenses", query = "SELECT e FROM Expense e where e.deleteFlag = FALSE"),
		@NamedQuery(name = "getExpensesToMatch", query =  "SELECT e FROM Expense e WHERE e.expenseId NOT IN (SELECT expense.expenseId from TransactionExpenses ) and e.expenseAmount <= :amount and e.deleteFlag = FALSE and e.status in :status and e.createdBy = :userId order by e.expenseId desc"),
		@NamedQuery(name = "postedExpenses", query = "SELECT e FROM Expense e where e.deleteFlag = FALSE and e.status in :status and e.createdBy = :userId order by e.expenseId desc") })

@Entity
@Table(name = "EXPENSE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Expense implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "EXPENSE_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
	private Integer expenseId;

	@Basic
	@Column(name = "EXPENSE_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal expenseAmount;

	@Basic
	@Column(name = "EXPENSE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime expenseDate;

	@Basic
	@Column(name = "EXPENSE_DESCRIPTION")
	private String expenseDescription;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "TRANSACTION_CATEGORY_CODE")
	@JsonManagedReference
	private TransactionCategory transactionCategory;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CURRENCY_CODE")
	@JsonManagedReference
	private Currency currency;

	@Basic
	@Column(name = "EXCHANGE_RATE", precision = 19, scale = 9)
	private BigDecimal exchangeRate;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PROJECT_ID")
	@JsonManagedReference
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "EMPLOYEE_ID")
	@JsonManagedReference
	private Employee employee;

	@Basic
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID")
	private User userId;

	@Basic
	@Column(name = "RECEIPT_NUMBER", length = 20)
	private String receiptNumber;

	@Basic
	@Column(name = "RECEIPT_ATTACHMENT_PATH")
	private String receiptAttachmentPath;

	@Basic
	@Column(name = "RECEIPT_ATTACHMENT_FILE_NAME")
	private String receiptAttachmentFileName;

	@Basic
	@Column(name = "RECEIPT_ATTACHMENT_DESCRIPTION")
	private String receiptAttachmentDescription;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Basic
	@Column(name = "STATUS", columnDefinition = "int default 1")
	private Integer status;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "VAT_ID")
	private VatCategory vatCategory;

	@Column(name = "PAY_MODE", columnDefinition = "varchar(32) default 'CASH'")
	@Enumerated(value = EnumType.STRING)

	private PayMode payMode;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ACCOUNT_ID")
	private BankAccount bankAccount;

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

	@Basic
	@Column(name = "PAYEE")
	private String payee;

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
