package com.simplevat.entity;

import com.simplevat.constant.PostingReferenceTypeEnum;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.converter.DateConverter;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Data;

/**
 * Created by saurabhg.
 */
@Entity
@Table(name = "JOURNAL_LINE_ITEM")
@Data
@NamedQueries({
		@NamedQuery(name = "getListByFrmToDateWthPagintion", query = " select jn from JournalLineItem jn INNER join Journal j on j.id = jn.journal.id where j.journalDate BETWEEN :startDate and :endDate"),
		@NamedQuery(name = "getListByTransactionCategory", query = " select jn from JournalLineItem jn where jn.transactionCategory = :transactionCategory") })
		@NamedQuery(name = "getVatTransationList",query =  "select jn FROM JournalLineItem jn WHERE jn.transactionCategory.transactionCategoryId IN (88,94) and jn.deleteFlag=false ")
public class JournalLineItem implements Serializable {
	/**
	 *
	 */
	private static final long serialVersionUID = 7790907788120167278L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private int id;

	@Basic
	@Column(name = "DESCRIPTION")
	private String description;

	@OneToOne
	@JoinColumn(name = "TRANSACTION_CATEGORY")
	private TransactionCategory transactionCategory;

	@OneToOne
	@JoinColumn(name = "CONTACT")
	private Contact contact;

	@OneToOne
	@JoinColumn(name = "VAT_CATEGORY")
	private VatCategory vatCategory;

	@Basic
	@Column(name = "DEBIT_AMOUNT")
	private BigDecimal debitAmount;

	@Basic
	@Column(name = "CREDIT_AMOUNT")
	private BigDecimal creditAmount;

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

	@ManyToOne
	@JoinColumn(name = "JOURNAL_ID")
	private Journal journal;

	@Column(name = "REFERENCE_ID")
	// commented to avoid error in journal save
	@Basic(optional = false)
	private Integer referenceId;

	@Column(name = "REFERENCE_TYPE")
	@Basic(optional = false)
	@Enumerated(value = EnumType.STRING)
	private PostingReferenceTypeEnum referenceType;

	@Basic(optional = false)
	@Column(name = "CURRENT_BALANCE")
	@ColumnDefault(value = "0.00")
	private BigDecimal currentBalance;

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
