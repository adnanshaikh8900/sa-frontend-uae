package com.simplevat.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.simplevat.constant.PayMode;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.converter.DateConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;
import javax.persistence.ManyToOne;
import javax.persistence.Convert;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Created by Ashish on 13/12/2019.
 */
@NamedQueries({
		@NamedQuery(name = "allPayments", query = "SELECT p FROM Payment p where p.deleteFlag = FALSE  ORDER BY p.paymentDate DESC"),
		@NamedQuery(name = "getAmountByInvoiceId", query = "SELECT p FROM Payment p where p.invoice.id = :id and  p.deleteFlag  = FALSE ") })

@Entity
@Table(name = "PAYMENT")
@Data
public class Payment implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Basic(optional = false)
	@Column(name = "ID")
	private Integer paymentId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "SUPPLIER_ID")
	private Contact supplier;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CURRENCY_CODE")
	@JsonManagedReference
	private Currency currency;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PROJECT_ID")
	@JsonManagedReference
	private Project project;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "BANK_ID")
	@JsonManagedReference
	private BankAccount bankAccount;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "INVOICE_ID")
	@JsonManagedReference
	private Invoice invoice;

	@Basic
	@Column(name = "PAYMENT_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime paymentDate;

	@Basic
	@Column(name = "DESCRIPTION")
	private String description;

	@Basic
	@Column(name = "INVOICE_AMOUNT")
	private BigDecimal invoiceAmount;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean deleteFlag = Boolean.FALSE;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	@CreationTimestamp
	private LocalDateTime createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdateBy;

	@Column(name = "LAST_UPDATE_DATE")
	@UpdateTimestamp
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Basic
	@Column(name = "PAYMENT_NO")
	private String paymentNo;

	@Basic
	@Column(name = "REFERENCE_NO")
	private String referenceNo;

	@Basic
	@Column(name = "NOTES")
	private String notes;

	@Enumerated(EnumType.STRING)
	@Column(name = "PAY_MODE")
	private PayMode payMode;

	@ManyToOne
	@JoinColumn(name = "DEPOSITE_TO_TRANSACTION_CATEGORY_ID")
	private TransactionCategory depositeToTransactionCategory;

	@Basic
	@Column(name = "ATTACHMENT_PATH")
	private String attachmentPath;

	@Basic
	@Column(name = "ATTACHMENT_FILE_NAME")
	private String attachmentFileName;

	@Basic
	@Column(name = "ATTACHMENT_DESCRIPTION")
	private String attachmentDescription;

}
