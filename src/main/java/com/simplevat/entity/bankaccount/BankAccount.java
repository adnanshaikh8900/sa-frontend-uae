package com.simplevat.entity.bankaccount;

import com.simplevat.entity.Country;
import com.simplevat.entity.Currency;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;

import lombok.Data;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
		@NamedQuery(name = "allBankAccounts", query = "SELECT b FROM BankAccount b where b.deleteFlag = FALSE  ORDER BY b.bankAccountStatus.bankAccountStatusName,b.bankAccountName ASC"),
		@NamedQuery(name = "allBankAccountsTotalBalance", query = "SELECT sum(b.currentBalance) FROM BankAccount b where b.deleteFlag = FALSE") })

@Entity
@Table(name = "BANK_ACCOUNT")
@Data
@Transactional
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class BankAccount implements Serializable {

	@Id
	@Column(name = "BANK_ACCOUNT_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY, generator = "INCREMENT_INITIAL_VALUE")
	private Integer bankAccountId;

	@Basic
	@Column(name = "BANK_ACCOUNT_NAME")
	private String bankAccountName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ACCOUNT_CURRENCY_CODE")
	private Currency bankAccountCurrency;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ACCOUNT_STATUS_CODE")
	private BankAccountStatus bankAccountStatus;

	@Basic(optional = false)
	@ColumnDefault(value = "'C'")
	@Column(name = "PERSONAL_CORPORATE_ACCOUNT_IND", length = 1)
	private Character personalCorporateAccountInd;

	@Basic(optional = false)
	@ColumnDefault(value = "1")
	@Column(name = "ISPRIMARY_ACCOUNT_FLAG")
	private Boolean isprimaryAccountFlag = Boolean.TRUE;

	@Basic
	@Column(name = "BANK_NAME")
	private String bankName;

	@Basic
	@Column(name = "ACCOUNT_NUMBER")
	private String accountNumber;

	@Basic
	@Column(name = "IFSC_CODE")
	private String ifscCode;
	@Basic
	@Column(name = "SWIFT_CODE")
	private String swiftCode;

	@Basic
	@ColumnDefault(value = "0.00")
	@Column(name = "OPENING_BALANCE")
	private BigDecimal openingBalance;

	@Basic
	@ColumnDefault(value = "0.00")
	@Column(name = "CURRENT_BALANCE")
	private BigDecimal currentBalance;

	@Basic
	@Column(name = "BANK_FEED_STATUS_CODE")
	private Integer bankFeedStatusCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_COUNTRY_CODE")
	private Country bankCountry;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Basic
	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdatedBy;

	@OneToOne
	@JoinColumn(name = "TRANSACTION_CATEGORY_CODE")
	private TransactionCategory transactionCategory;

	@Basic
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ACCOUNT_TYPE_CODE")
	private BankAccountType bankAccountType;

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
