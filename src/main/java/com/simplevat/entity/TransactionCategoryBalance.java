package com.simplevat.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.simplevat.entity.bankaccount.TransactionCategory;

import lombok.Data;

@Entity
@Table(name = "TRANSACTION_CATEGORY_BALANCE")
@Data
public class TransactionCategoryBalance {

	@Id
	@Column(name = "TRANSACTION_CATEGORY_BALANCE_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@OneToOne
	@JoinColumn(name = "TRANSACTION_CATEGORY_ID")
	@Basic(optional = false)
	private TransactionCategory transactionCategory;

	@Column(name = "OPENING_BALANCE")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private BigDecimal openingBalance;

	
	@Column(name = "RUNNING_BALANCE")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private BigDecimal runningBalance;

	
	@Column(name = "EFFECTIVE_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	private Date effectiveDate;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Temporal(TemporalType.TIMESTAMP)
	@CreationTimestamp
	private Date createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdateBy;

	@Column(name = "LAST_UPDATE_DATE")
	@Temporal(TemporalType.TIMESTAMP)
	@UpdateTimestamp
	private Date lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private boolean deleteFlag;

}
