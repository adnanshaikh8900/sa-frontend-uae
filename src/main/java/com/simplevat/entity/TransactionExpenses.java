package com.simplevat.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.simplevat.constant.TransactionExplinationStatusEnum;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

/**
 * Middle table for mapping between transaction and expense
 */
@Entity
@Table(name = "TRANSACTON_EXPENSES")
@Data
public class TransactionExpenses {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private int id;

	@Basic(optional = false)
	@Enumerated(EnumType.STRING)
	@Column(name = "EXPLANATION_STATUS_NAME")
	private TransactionExplinationStatusEnum explinationStatus;

	@Basic(optional = false)
	@Column(name = "REMANING_TO_EXLAIN_BALANCE")
	@ColumnDefault(value = "0.00")
	private BigDecimal remainingToExplain;

	@ManyToOne
	@JoinColumn(name = "TRANSACTION_ID")
	private Transaction transaction;

	@ManyToOne
	@JoinColumn(name = "EXPENSE_ID")
	private Expense expense;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@CreationTimestamp
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdateBy;

	@Column(name = "LAST_UPDATE_DATE")
	@UpdateTimestamp
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

}
