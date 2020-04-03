package com.simplevat.entity;

import java.time.LocalDateTime;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Version;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UpdateTimestamp;

import com.simplevat.entity.converter.DateConverter;

import lombok.Data;

@NamedQueries({ @NamedQuery(name = "getSetting", query = "SELECT c FROM CompanySetting c") })
@Entity
@Table(name = "COMPANY_SETTING")
@Data
public class CompanySetting {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "COMPANY_SETTING_ID")
	private Integer id;

	@Basic
	@Column(name = "INVOICING_REFERENCE_PATTERN")
	private String invoicingRefrencePattern;

	@Basic
	@Column(name = "MAILING_HOST")
	private String mailingHost;

	@Basic
	@Column(name = "MAILING_PORT")
	private String mailingPort;

	@Basic
	@Column(name = "MAILING_USERNAME")
	private String mailingUserName;

	@Basic
	@Column(name = "MAILING_PASSWORD")
	private String mailingPASSWORD;

	@Basic
	@Column(name = "MAILING_SMTP_AUTH")
	private boolean mailingSmtpAuthorization;

	@Basic
	@Column(name = "MAILING_SMTP_STARTTLUS_ENABLE")
	private boolean mailingSmtpStarttlsEnable;

	@Basic
	@Column(name = "INVOICE_MAILING_SUBJECT")
	private String invoiceMailingSubject;

	@Basic
	@Column(name = "INVOICE_MAILING_BODY")
	private String invoiceMailingBody;

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
	@UpdateTimestamp
	@Column(name = "LAST_UPDATE_DATE")
	@Convert(converter = DateConverter.class)
	private LocalDateTime lastUpdateDate;

	@Column(name = "DELETE_FLAG")
	@ColumnDefault(value = "0")
	@Basic(optional = false)
	private Boolean deleteFlag = Boolean.FALSE;

	@Column(name = "VERSION_NUMBER")
	@ColumnDefault(value = "1")
	@Basic(optional = false)
	@Version
	private Integer versionNumber = 1;
}
