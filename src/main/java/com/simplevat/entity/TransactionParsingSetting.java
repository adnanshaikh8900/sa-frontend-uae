package com.simplevat.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;

import com.simplevat.entity.converter.DateConverter;
import com.simplevat.constant.ExcellDelimiterEnum;

import lombok.Data;

@Entity
@Table(name = "TRANSACTION_PARSING_SETTING")
@Data
@NamedQueries({
		@NamedQuery(name = "getDateFormatIdTemplateId", query = "select df.format from TransactionParsingSetting t inner join DateFormat df on df.id=t.dateFormat where t.id = :id") })
public class TransactionParsingSetting implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@Basic
	@Column(name = "NAME")
	private String name;

	@Column
	@Enumerated(EnumType.STRING)
	private ExcellDelimiterEnum delimiter;

	@Column(name = "OTHER_DELIMITER")
	private String otherDilimiterStr;

	@Column(name = "SKIP_ROWS")
	private Integer skipRows;

	@Column(name = "HEADER_ROW_NO")
	private Integer headerRowNo;

	@Column(name = "TEXT_QUALIFIER")
	private String textQualifier;

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

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "TRANSACTION_DATA_COL_MAPPING_ID")
	List<TransactionDataColMapping> TransactionDtaColMapping;

}
