package com.simplevat.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.simplevat.entity.bankaccount.ChartOfAccount;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "COA_COA_CATEGORY")
@Getter
@Setter
public class CoaCoaCategory implements Serializable{

	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_OF_ACCOUNT_ID ")
	private ChartOfAccount chartOfAccount;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CHART_OF_ACCOUNT_CATEGORY_ID ")
	private ChartOfAccountCategory chartOfAccountCategory;
	

}
