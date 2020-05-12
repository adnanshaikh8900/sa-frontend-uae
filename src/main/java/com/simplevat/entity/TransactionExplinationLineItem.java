package com.simplevat.entity;

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
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

/**
 * @author S@urabh
 */
@Data
@Entity
@Table(name = "TRANSACTION_EXPLINATION_LINE_ITEM")
public class TransactionExplinationLineItem {

	@Id
	@Column(name = "ID")
	@Basic(optional = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "TRANSACTION_ID")
	private Transaction transaction;

	@OneToOne
	@JoinColumn(name = "Id")
	private Invoice invoice;

	@Column(name = "REMANINING_BALANCE")
	@ColumnDefault(value = "0.00")
	private BigDecimal currentBalance;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@CreationTimestamp
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

}
