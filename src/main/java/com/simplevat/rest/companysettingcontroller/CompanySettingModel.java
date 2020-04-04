package com.simplevat.rest.companysettingcontroller;

import lombok.Data;

@Data
public class CompanySettingModel {

	private Integer id;

	private String invoicingReferencePattern;

	private String mailingHost;

	private String mailingPort;

	private String mailingUserName;

	private String mailingPassword;

	private String mailingSmtpAuthorization;

	private String mailingSmtpStarttlsEnable;

	private String invoiceMailingSubject;

	private String invoiceMailingBody;

}
