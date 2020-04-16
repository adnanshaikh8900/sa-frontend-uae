package com.simplevat.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import lombok.Data;

@Entity
@Table(name = "CHART_OF_ACCOUNT_CATEGORY")
@Data
@NamedQueries({
		@NamedQuery(name = "allChartOfAccountCategory", query = "SELECT c FROM ChartOfAccountCategory c where c.deleteFlag = FALSE") })
public class ChartOfAccountCategory implements Serializable {

	@Id
	@Column(name = "CHART_OF_ACCOUNT_CATEGORY_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer chartOfAccountCategoryId;

	@Column(name = "CHART_OF_ACCOUNT_CATEGORY_NAME")
	@Basic(optional = false)
	private String chartOfAccountCategoryName;

	@Column(name = "CHART_OF_ACCOUNT_CATEGORY_DESCRIPTION")
	private String chartOfAccountCategoryDescription;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_CHART_OF_ACCOUNT_CATEGORY_ID")
	private ChartOfAccountCategory parentChartOfAccount;

	@Column(name = "CHART_OF_ACCOUNT_CATEGORY_CODE")
	@Basic(optional = false)
	private String chartOfAccountCategoryCode;

	@Column(name = "SELECT_FLAG")
	@ColumnDefault(value = "'N'")
	@Basic(optional = false)
	private Character selectFlag;

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

	@OneToMany(mappedBy = "chartOfAccountCategory", fetch = FetchType.LAZY)
	private List<CoaCoaCategory> coacoaCategoryList;

	@OneToMany(mappedBy = "chartOfAccountCategory", fetch = FetchType.LAZY)
	private List<CoaTransactionCategory> coatransactionCategoryList;

}
