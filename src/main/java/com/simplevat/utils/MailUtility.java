package com.simplevat.utils;

import com.simplevat.entity.Configuration;
import com.simplevat.entity.Mail;
import com.simplevat.integration.MailIntegration;
import com.simplevat.service.ConfigurationService;
import com.simplevat.constant.ConfigurationConstants;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

/**
 *
 * @author h
 */
@Component
public class MailUtility {
	private final static Logger LOGGER = LoggerFactory.getLogger(MailUtility.class);

	@Autowired
	private MailIntegration MailIntegration;

	@Autowired
	private ConfigurationService configurationService;

	public static final String INVOICE_REFEREBCE_NO = "Invoice_Reference_Number";
	public static final String INVOICE_DATE = "Invoice_Date";
	public static final String INVOICE_DUE_DATE = "Invoice_Due_Date";
	public static final String INVOICE_DISCOUNT = "Invoic_Discount";
	public static final String CONTRACT_PO_NUMBER = "contract_Po_Number";
	public static final String CONTACT_NAME = "Contact_Name";
	public static final String PROJECT_NAME = "Project_Name";
	public static final String INVOICE_AMOUNT = "Invoice_Amount";
	public static final String DUE_AMOUNT = "Due_Amount";
	public static final String SENDER_NAME = "Sender_Name";
	public static final String COMPANY_NAME = "Company_Name";
	public static final String SUB_TOTAL = "Sub_Total";
	public static final String MOBILE_NUMBER = "Mobile_Number";
	public static final String CONTACT_ADDRESS = "Contact_Address";
	public static final String CONTACT_COUNTRY = "Contact_Country";
	public static final String CONTACT_STATE = "Contact_State";
	public static final String CONTACT_CITY = "Contact_City";
	public static final String INVOICE_DUE_PERIOD = "Invoice_Due_Period";
	public static final String INVOICE_VAT_AMOUNT = "Invoice_Vat_Amount";
	public static final String PRODUCT = "PRODUCT";
	public static final String QUANTITY = "Quantity";
	public static final String UNIT_PRICE = "Unit_Price";
	public static final String TOTAL = "Total";
	public static final String VAT_TYPE="Vat_Type";



	public void triggerEmailOnBackground(String subject, String body, MimeMultipart mimeMultipart, String fromEmailId,
			String fromName, String[] toMailAddress, boolean isHtml) {
		Thread t = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					Mail mail = new Mail();
					mail.setFrom(fromEmailId);
					mail.setFromName(fromName);
					mail.setTo(toMailAddress);
					mail.setSubject(subject);
					mail.setBody(body);
					MailIntegration.sendHtmlEmail(mimeMultipart, mail,
							getJavaMailSender(configurationService.getConfigurationList()), isHtml);
				} catch (Exception ex) {
					LOGGER.error("Error", ex);
				}
			}
		});
		t.start();
	}

	public static JavaMailSender getJavaMailSender(List<Configuration> configurationList) {
		MailConfigurationModel mailDefaultConfigurationModel = getEMailConfigurationList(configurationList);
		return getJavaMailSender(mailDefaultConfigurationModel);
	}

	public static JavaMailSender getDefaultJavaMailSender() {
		return getJavaMailSender(getDefaultEmailConfigurationList());
	}

	public static JavaMailSender getJavaMailSender(MailConfigurationModel mailConfigurationModel) {
		JavaMailSenderImpl sender = new JavaMailSenderImpl();
		sender.setProtocol("smtp");
		sender.setHost(mailConfigurationModel.getMailhost());
		sender.setPort(Integer.parseInt(mailConfigurationModel.getMailport()));
		sender.setUsername(mailConfigurationModel.getMailusername());
		sender.setPassword(mailConfigurationModel.getMailpassword());
		Properties mailProps = new Properties();
		//mailProps.put("mail.smtps.auth", mailmaConfiigurationModel.getMailsmtpAuth());
		mailProps.put("mail.transport.protocol", "smtp");
		mailProps.put("mail.smtps.host", mailConfigurationModel.getMailhost());
		mailProps.put("mail.smtp.starttls.enable", mailConfigurationModel.getMailstmpStartTLSEnable());
		mailProps.put("mail.smtp.debug", "true");
		mailProps.put("mail.smtps.auth", "true");
		mailProps.put("mail.smtp.socketFactory.port", "465");
		mailProps.put("mail.smtp.starttls.enable prop", "true");
		mailProps.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		mailProps.put("mail.smtp.ssl.checkserveridentity", true);

		sender.setJavaMailProperties(mailProps);
		return sender;
	}

	public static MailConfigurationModel getEMailConfigurationList(List<Configuration> configurationList) {
		MailConfigurationModel mailDefaultConfigurationModel = getDefaultEmailConfigurationList();

		if (isDbConfigAvailable(configurationList)) {
			
			Optional<Configuration> config = configurationList.stream()
					.filter(mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_HOST))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailhost(config.get().getValue());
			}

			config = configurationList.stream()
					.filter(mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PORT))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailport(config.get().getValue());
			}
			config = configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_USERNAME))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailusername(config.get().getValue());
			}

			config = configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_PASSWORD))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailpassword(config.get().getValue());
			}

			config = configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_SMTP_AUTH))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailsmtpAuth(config.get().getValue());
			}

			config = configurationList.stream().filter(
					mailConfiguration -> mailConfiguration.getName().equals(ConfigurationConstants.MAIL_API_KEY))
					.findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailApiKey(config.get().getValue());
			}

			config = configurationList.stream().filter(mailConfiguration -> mailConfiguration.getName()
					.equals(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE)).findAny();
			if (config.isPresent()) {
				mailDefaultConfigurationModel.setMailstmpStartTLSEnable(config.get().getValue());
			}
		}
		return mailDefaultConfigurationModel;
	}

	public static MailConfigurationModel getDefaultEmailConfigurationList() {
		MailConfigurationModel mailDefaultConfigurationModel = new MailConfigurationModel();
		mailDefaultConfigurationModel.setMailhost(System.getenv("SIMPLEVAT_SMTP_HOST"));
		mailDefaultConfigurationModel.setMailport(System.getenv("SIMPLEVAT_SMTP_PORT"));
		mailDefaultConfigurationModel.setMailusername(System.getenv("SIMPLEVAT_SMTP_USER"));
		mailDefaultConfigurationModel.setMailpassword(System.getenv("SIMPLEVAT_SMTP_PASS"));
		mailDefaultConfigurationModel.setMailsmtpAuth(System.getenv("SIMPLEVAT_SMTP_AUTH"));
		mailDefaultConfigurationModel.setMailApiKey(System.getenv("SIMPLEVAT_API_KEY"));
		mailDefaultConfigurationModel.setMailstmpStartTLSEnable(System.getenv("SIMPLEVAT_SMTP_STARTTLS_ENABLE"));
		return mailDefaultConfigurationModel;
	}

	public String create(Map<String, String> dataMap, String data) {
		for (String key : dataMap.keySet()) {
			if (dataMap.containsKey(key) && dataMap.get(key) != null)
				data = data.replace(key, dataMap.get(key));
		}
		return data;
	}

	public Map<String, String> getInvoiceEmailParamMap() {

		Map<String, String> dataMap = new HashMap<String, String>();
		dataMap.put(INVOICE_REFEREBCE_NO, "{invoicingReferencePattern}");
		dataMap.put(INVOICE_DATE, "{invoiceDate}");
		dataMap.put(INVOICE_DUE_DATE, "{invoiceDueDate}");
		dataMap.put(INVOICE_DISCOUNT, "{invoiceDiscount}");
		dataMap.put(CONTRACT_PO_NUMBER, "{contractPoNumber}");
		dataMap.put(CONTACT_NAME, "{contactName}");
		dataMap.put(PROJECT_NAME, "{projectName}");
		dataMap.put(INVOICE_AMOUNT, "{invoiceAmount}");
		dataMap.put(DUE_AMOUNT, "{dueAmount}	");
		dataMap.put(SENDER_NAME, "{senderName}");
		dataMap.put(COMPANY_NAME, "{companyName}");
		dataMap.put(PROJECT_NAME, "{projectName}");
		dataMap.put(INVOICE_AMOUNT, "{invoiceAmount}");
		dataMap.put(DUE_AMOUNT, "{dueAmount}");
		dataMap.put(SUB_TOTAL, "{subTotal}");
		dataMap.put(MOBILE_NUMBER, "{mobileNumber}");
		dataMap.put(CONTACT_ADDRESS, "{contactAddress}");
		dataMap.put(CONTACT_COUNTRY, "{contactCountry}");
		dataMap.put(CONTACT_STATE, "{contactState}");
		dataMap.put(CONTACT_CITY, "{contactCity}");
		dataMap.put(INVOICE_DUE_PERIOD, "{invoiceDuePeriod}");
		dataMap.put(INVOICE_VAT_AMOUNT, "{invoiceVatAmount}");
		dataMap.put(PRODUCT, "{product}");
		dataMap.put(QUANTITY, "{quantity}");
		dataMap.put(UNIT_PRICE, "{unitPrice}");
		dataMap.put(TOTAL, "{total}");
		dataMap.put(VAT_TYPE,"{vatType}");


		return dataMap;
	}

	private static boolean isDbConfigAvailable(List<Configuration> configurationList) {
		int mailConfigCount = 0;
		if (configurationList != null && !configurationList.isEmpty()) {
			for (Configuration configuration : configurationList) {
				if (configuration.getName().equals(ConfigurationConstants.MAIL_HOST) && configuration.getValue() != null
						&& !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_PORT)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_USERNAME)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_PASSWORD)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_SMTP_AUTH)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_API_KEY)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE)
						&& configuration.getValue() != null && !configuration.getValue().isEmpty()) {
					mailConfigCount++;

				}
			}
		}
		return (mailConfigCount == 7);
	}
}
