package com.simplevat.entity;

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
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;

import lombok.Data;

@Entity
@Table(name = "STATE")
@Data
public class State {
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "STATE_ID")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Basic(optional = false)
	@Column(name = "STATE_NAME")
	private String stateName;

	@OneToOne
	@JoinColumn(name = "COUNTRY_ID")
	private Country country;

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
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;

	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdateBy;

	@Column(name = "LAST_UPDATE_DATE")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private boolean deleteFlag;

	@Column(name = "VERSION_NUMBER")
	@ColumnDefault(value = "1")
	@Basic(optional = false)
	@Version
	private Integer versionNumber;

}
