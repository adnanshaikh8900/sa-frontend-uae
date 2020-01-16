package com.simplevat.entity;

import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

@Entity
@Table(name = "TRANSACTION_DATA_COL_MAPPING")
@Data
public class TransactionDataColMapping {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Integer id;

	@Column(name = "COL_NAME")
	private String colName;

	@Column(name = "FILE_COL_INDEX")
	private Integer fileColIndex;

	@OneToOne
	@JoinColumn(name = "DATE_FORMAT_ID")
	private DateFormat dateFormat;

	@Column(name = "CREATED_BY")
	@Basic(optional = false)
	private Integer createdBy;

	@Column(name = "CREATED_DATE")
	@ColumnDefault(value = "CURRENT_TIMESTAMP")
	@Basic(optional = false)
	@Convert(converter = DateConverter.class)
	private LocalDateTime createdDate;

	@Basic
	@Column(name = "LAST_UPDATED_BY")
	private Integer lastUpdatedBy;

	@Basic
	@Column(name = "LAST_UPDATE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean deleteFlag = Boolean.FALSE;
}
