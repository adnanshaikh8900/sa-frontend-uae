package com.simplevat.entity;

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
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.TableGenerator;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

/**
 * @author saurabhg.
 */
@Entity
@Table(name = "JOURNAL")
@Data
@TableGenerator(name = "INCREMENT_INITIAL_VALUE", initialValue = 1000)
public class Journal implements Serializable {
	/**
	* 
	*/
	private static final long serialVersionUID = -6038849464759772457L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private int id;

	@Basic
	@Column(name = "JOURNAL_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime journalDate;

	@Basic
	@Column(name = "REFERENCE_CODE")
	private String referenceCode;

	@Basic
	@Column(name = "DESCRIPTION")
	private String description;

	@OneToOne
	@JoinColumn(name = "CURRENCY_ID")
	private Currency currency;

	@Basic
	@Column(name = "SUB_TOTAL_DEBIT_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal subTotalDebitAmount;

	@Basic
	@Column(name = "TOTAL_DEBIT_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal totalDebitAmount;

	@Basic
	@Column(name = "TOTAL_CREDIT_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal TotalCreditAmount;

	@Basic
	@Column(name = "SUB_TOTAL_CREDIT_AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal subTotalCreditAmount;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "journal")
	private Collection<JournalLineItem> journalLineItems;
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
