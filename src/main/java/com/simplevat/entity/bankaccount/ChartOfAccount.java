package com.simplevat.entity.bankaccount;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import org.hibernate.annotations.ColumnDefault;

/**
 * Created by mohsinh on 2/26/2017.
 */
@NamedQueries({
		@NamedQuery(name = "findAllChartOfAccount", query = "SELECT c FROM ChartOfAccount c where c.deleteFlag=false ORDER BY c.defaltFlag DESC , c.orderSequence,c.chartOfAccountName ASC"),
		@NamedQuery(name = "findAllChildChartOfAccount", query = "SELECT c FROM ChartOfAccount c where c.deleteFlag=false and c.parentChartOfAccount != null ORDER BY c.defaltFlag DESC , c.orderSequence,c.chartOfAccountName ASC"),
		@NamedQuery(name = "findMoneyInChartOfAccount", query = "SELECT c FROM ChartOfAccount c where c.deleteFlag=false AND c.parentChartOfAccount.chartOfAccountId = 1 ORDER BY c.defaltFlag DESC , c.orderSequence,c.chartOfAccountName ASC"),
		@NamedQuery(name = "findMoneyOutChartOfAccount", query = "SELECT c FROM ChartOfAccount c where c.deleteFlag=false AND c.parentChartOfAccount.chartOfAccountId = 7 ORDER BY c.defaltFlag DESC , c.orderSequence,c.chartOfAccountName ASC") })
@Entity
@Table(name = "CHART_OF_ACCOUNT")
@Data
@NoArgsConstructor
public class ChartOfAccount implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "CHART_OF_ACCOUNT_ID")
	private Integer chartOfAccountId;

	@Column(name = "CHART_OF_ACCOUNT_NAME")
	@Basic(optional = false)
	private String chartOfAccountName;

	@Column(name = "CHART_OF_ACCOUNT_DESCRIPTION")
	private String chartOfAccountDescription;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_CHART_OF_ACCOUNT_ID")
	private ChartOfAccount parentChartOfAccount;

	@Column(name = "DEBIT_CREDIT_FLAG")
	@Basic(optional = false)
	private Character debitCreditFlag;

	@Column(name = "CHART_OF_ACCOUNT_CODE")
	@Basic(optional = false)
	private String chartOfAccountCode;

	@Column(name = "DEFAULT_FLAG")
	@ColumnDefault(value = "'N'")
	@Basic(optional = false)
	private Character defaltFlag;

	@Column(name = "ORDER_SEQUENCE")
	@Basic(optional = true)
	private Integer orderSequence;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private boolean deleteFlag;

	public ChartOfAccount(Integer chartOfAccountId) {
		this.chartOfAccountId = chartOfAccountId;
	}
}
