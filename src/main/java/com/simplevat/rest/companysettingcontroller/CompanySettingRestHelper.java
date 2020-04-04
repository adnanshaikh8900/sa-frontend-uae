package com.simplevat.rest.companysettingcontroller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ConfigurationConstants;
import com.simplevat.entity.Configuration;
import com.simplevat.service.ConfigurationService;

@Component
public class CompanySettingRestHelper {

	@Autowired
	private ConfigurationService configurationService;

	public CompanySettingModel getModel() {

		List<Configuration> configurationList = configurationService.getConfigurationList();

		if (configurationList != null && !configurationList.isEmpty()) {
			CompanySettingModel companySettingModel = new CompanySettingModel();

			if (configurationList.stream()
					.filter(mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_HOST))
					.findAny().isPresent()) {
				companySettingModel.setMailingHost(configurationList.stream().filter(
						mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_HOST))
						.findAny().get().getValue());
			}
			if (configurationList.stream()
					.filter(mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PORT))
					.findAny().isPresent()) {
				companySettingModel.setMailingPort(configurationList.stream().filter(
						mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PORT))
						.findAny().get().getValue());
			}
			if (configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_USERNAME))
					.findAny().isPresent()) {
				companySettingModel.setMailingUserName(configurationList.stream().filter(
						mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_USERNAME))
						.findAny().get().getValue());
			}
			if (configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PASSWORD))
					.findAny().isPresent()) {
				companySettingModel.setMailingPassword(configurationList.stream().filter(
						mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PASSWORD))
						.findAny().get().getValue());
			}
			if (configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_SMTP_AUTH))
					.findAny().isPresent()) {
				companySettingModel.setMailingSmtpAuthorization(configurationList.stream().filter(
						mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_SMTP_AUTH))
						.findAny().get().getValue());
			}
			if (configurationList.stream().filter(mailConfiguration -> mailConfiguration.getName()
					.equals(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE)).findAny().isPresent()) {
				companySettingModel
						.setMailingSmtpStarttlsEnable(configurationList.stream()
								.filter(mailConfiguration -> mailConfiguration.getName()
										.equals(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE))
								.findAny().get().getValue());
			}

			if (configurationList.stream().filter(mailConfiguration -> mailConfiguration.getName()
					.equals(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_SUBJECT)).findAny().isPresent()) {
				companySettingModel.setInvoiceMailingSubject(configurationList.stream()
						.filter(mailConfiguration -> mailConfiguration.getName()
								.equals(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_SUBJECT))
						.findAny().get().getValue());
			}

			if (configurationList.stream().filter(mailConfiguration -> mailConfiguration.getName()
					.equals(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_BODY)).findAny().isPresent()) {
				companySettingModel
						.setInvoiceMailingBody(configurationList.stream()
								.filter(mailConfiguration -> mailConfiguration.getName()
										.equals(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_BODY))
								.findAny().get().getValue());
			}

			if (configurationList.stream().filter(mailConfiguration -> mailConfiguration.getName()
					.equals(ConfigurationConstants.INVOICING_REFERENCE_PATTERN)).findAny().isPresent()) {
				companySettingModel.setInvoicingReferencePattern(configurationList.stream()
						.filter(mailConfiguration -> mailConfiguration.getName()
								.equals(ConfigurationConstants.INVOICING_REFERENCE_PATTERN))
						.findAny().get().getValue());
			}

			return companySettingModel;
		}
		return null;
	}

	public List<Configuration> getEntity(CompanySettingRequestModel companySettingReqModel) {

		if (companySettingReqModel != null) {

			List<Configuration> configList = new ArrayList<>();
			Configuration config = null;
			if (companySettingReqModel.getInvoiceMailingBody() != null
					&& !companySettingReqModel.getInvoiceMailingBody().isEmpty()) {
				config = configurationService.getConfigurationByName(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_BODY);
				config.setValue(companySettingReqModel.getInvoiceMailingBody());
				configList.add(config);
			}

			if (companySettingReqModel.getInvoicingReferencePattern() != null
					&& !companySettingReqModel.getInvoicingReferencePattern().isEmpty()) {
				config = configurationService
						.getConfigurationByName(ConfigurationConstants.INVOICING_REFERENCE_PATTERN);
				config.setValue(companySettingReqModel.getInvoicingReferencePattern());
				configList.add(config);

			}

			if (companySettingReqModel.getMailingHost() != null && !companySettingReqModel.getMailingHost().isEmpty()) {
				config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_HOST);
				config.setValue(companySettingReqModel.getMailingHost());
				configList.add(config);

			}

			if (companySettingReqModel.getMailingPort() != null && !companySettingReqModel.getMailingPort().isEmpty()) {
				config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_PORT);
				config.setValue(companySettingReqModel.getMailingPort());
				configList.add(config);

			}

			if (companySettingReqModel.getMailingUserName() != null
					&& !companySettingReqModel.getMailingUserName().isEmpty()) {
				config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_USERNAME);
				config.setValue(companySettingReqModel.getMailingUserName());
				configList.add(config);

			}

			if (companySettingReqModel.getMailingPassword() != null
					&& !companySettingReqModel.getMailingPassword().isEmpty()) {
				config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_PASSWORD);
				config.setValue(companySettingReqModel.getMailingPassword());
				configList.add(config);

			}

			config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_SMTP_AUTH);
			config.setValue(companySettingReqModel.getMailingSmtpAuthorization());
			configList.add(config);

			config = configurationService.getConfigurationByName(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE);
			config.setValue(companySettingReqModel.getMailingSmtpStarttlsEnable());
			configList.add(config);

			if (companySettingReqModel.getInvoiceMailingSubject() != null
					&& !companySettingReqModel.getInvoiceMailingSubject().isEmpty()) {
				config = configurationService
						.getConfigurationByName(ConfigurationConstants.INVOICE_MAIL_TAMPLATE_SUBJECT);
				config.setValue(companySettingReqModel.getInvoiceMailingSubject());
				configList.add(config);
			}

			return configList;

		}
		return null;
	}

}
