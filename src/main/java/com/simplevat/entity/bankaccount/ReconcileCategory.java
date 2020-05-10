package com.simplevat.entity.bankaccount;

import java.io.Serializable;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "RECONCILE_CATEGORY")
@Data
@NoArgsConstructor
@AllArgsConstructor
@NamedQueries({
		@NamedQuery(name = "allReconcileCategoryByparentReconcileCategoryId", query = "from ReconcileCategory rc where rc.deleteFlag = false and rc.parentReconcileCategory.id = :code") })
public class ReconcileCategory implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "ID")
	private Integer id;

	@Column(name = "RECONCILE_CATEGORY_NAME")
	@Basic(optional = false)
	private String reconcileCategoryName;

	@Column(name = "RECONCILE_CATEGORY_DESCRIPTION")
	private String reconcileCategoryDescription;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_RECONCILE_CATEGORY_ID")
	private ReconcileCategory parentReconcileCategory;

	@Column(name = "RECONCILE_CATEGORY_CODE")
	@Basic(optional = false)
	private String reconcileCategoryCode;

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
}
