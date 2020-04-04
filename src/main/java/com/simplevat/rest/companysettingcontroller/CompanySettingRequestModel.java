package com.simplevat.rest.companysettingcontroller;

import lombok.Data;

@Data
public class CompanySettingRequestModel {

	private Integer id;

	private String invoicingRefrencePattern;

	private String mailingHost;

	private String mailingPort;

	private String mailingUserName;

	private String mailingPASSWORD;

	private boolean mailingSmtpAuthorization;

	private boolean mailingSmtpStarttlsEnable;

	private String invoiceMailingSubject;

	private String invoiceMailingBody;

}
