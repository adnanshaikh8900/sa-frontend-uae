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
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.constant.PayMode;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

/**
 * @author Saurabhg
 */
@Entity
@Table(name = "RECEIPT")
@Data
public class Receipt {

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Basic
	@Column(name = "RECEIPT_NO")
	private String receiptNo;

	@Basic
	@Column(name = "RECEIPT_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime receiptDate;

	@Basic
	@Column(name = "REFERENCE_CODE")
	private String referenceCode;

	@OneToOne
	@JoinColumn(name = "CONTACT_ID")
	private Contact contact;

	@OneToOne
	@JoinColumn(name = "INVOICE_ID")
	private Invoice invoice;

	@Basic
	@Column(name = "AMOUNT")
	@ColumnDefault(value = "0.00")
	private BigDecimal amount;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdatedBy;

	@Column(name = "LAST_UPDATE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean deleteFlag = Boolean.FALSE;

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
	@Column(name = "RECEIPT_ATTACHMENT_PATH")
	private String receiptAttachmentPath;

	@Basic
	@Column(name = "RECEIPT_ATTACHMENT_FILE_NAME")
	private String receiptAttachmentFileName;

	@Basic
	@Column(name = "RECEIPT_ATTACHMENT_DESCRIPTION")
	private String receiptAttachmentDescription;

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
