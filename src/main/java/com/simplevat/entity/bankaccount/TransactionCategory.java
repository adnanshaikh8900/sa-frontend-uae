package com.simplevat.entity.bankaccount;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.VatCategory;
import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
		@NamedQuery(name = "findAllTransactionCategory", query = "SELECT t FROM TransactionCategory t where t.deleteFlag=false ORDER BY t.defaltFlag DESC , t.transactionCategoryName ASC"),
		@NamedQuery(name = "findAllTransactionCategoryBychartOfAccount", query = "SELECT t FROM TransactionCategory t where t.deleteFlag=FALSE AND t.chartOfAccount.chartOfAccountId =:chartOfAccountId ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC"),
		@NamedQuery(name = "findAllTransactionCategoryByUserId", query = "SELECT t FROM TransactionCategory t where t.deleteFlag=false and (t.createdBy = :createdBy or t.createdBy = 1) ORDER BY t.defaltFlag DESC , t.orderSequence,t.transactionCategoryName ASC"),
		@NamedQuery(name = "findMaxTnxCodeByChartOfAccId", query = "SELECT t FROM TransactionCategory t where chartOfAccount =:chartOfAccountId ORDER BY transactionCategoryId  DESC"),
		@NamedQuery(name = "findTnxCatForReicpt", query = "SELECT t FROM TransactionCategory t WHERE t.transactionCategoryCode in  ('01-04-006') or t.chartOfAccount.chartOfAccountId =8 or t.parentTransactionCategory.transactionCategoryId = 46  and t.deleteFlag=false ")

})

@Entity
@Table(name = "TRANSACTION_CATEGORY")
@Data
public class TransactionCategory implements Serializable {

	private static final long serialVersionUID = 848122185643690684L;

	@Id
	@Column(name = "TRANSACTION_CATEGORY_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer transactionCategoryId;

	@Basic(optional = false)
	@Column(name = "TRANSACTION_CATEGORY_NAME")
	private String transactionCategoryName;

	@Basic
	@Column(name = "TRANSACTION_CATEGORY_DESCRIPTION")
	private String transactionCategoryDescription;

	@Basic
	@Column(name = "TRANSACTION_CATEGORY_CODE")
	private String transactionCategoryCode;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_OF_ACCOUNT_ID")
	private ChartOfAccount chartOfAccount;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_TRANSACTION_CATEGORY_CODE")
	private TransactionCategory parentTransactionCategory;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "VAT_CATEGORY_CODE")
	private VatCategory vatCategory;

	@Column(name = "DEFAULT_FLAG")
	@ColumnDefault(value = "'N'")
	@Basic(optional = false)
	private Character defaltFlag;

	@Column(name = "ORDER_SEQUENCE")
	@Basic(optional = true)
	private Integer orderSequence;

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

	@Column(name = "SELECTABLE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean selectableFlag = Boolean.FALSE;

	@Column(name = "EDITABLE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean editableFlag = Boolean.FALSE;

	@Column(name = "VERSION_NUMBER")
	@ColumnDefault(value = "1")
	@Basic(optional = false)
	@Version
	private Integer versionNumber;

}
