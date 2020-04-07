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
		mailProps.put("mail.smtps.auth", mailConfigurationModel.getMailsmtpAuth());
		mailProps.put("mail.smtp.starttls.enable", mailConfigurationModel.getMailstmpStartTLSEnable());
		mailProps.put("mail.smtp.debug", "true");
		mailProps.put("mail.smtp.socketFactory.port", "465");
		mailProps.put("mail.smtp.starttls.enable prop", "true");
		mailProps.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

		sender.setJavaMailProperties(mailProps);
		return sender;
	}

	public static MailConfigurationModel getEMailConfigurationList(List<Configuration> configurationList) {
		MailConfigurationModel mailDefaultConfigurationModel = getDefaultEmailConfigurationList();
		int mailConfigCount = 0;
		if (configurationList != null && !configurationList.isEmpty()) {
			for (Configuration configuration : configurationList) {
				if (configuration.getName().equals(ConfigurationConstants.MAIL_HOST)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_PORT)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_USERNAME)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_PASSWORD)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_SMTP_AUTH)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				} else if (configuration.getName().equals(ConfigurationConstants.MAIL_SMTP_STARTTLS_ENABLE)) {
					if (configuration.getValue() != null && !configuration.getValue().isEmpty()) {
						mailConfigCount++;
					}
				}
			}
		}
		if (mailConfigCount == 6) {

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

	public static final String Invoice_Reference_Number = "Invoice_Reference_Number";
	public static final String Invoice_Date = "Invoice_Date";
	public static final String Invoice_Due_Date = "Invoice_Due_Date";
	public static final String Invoic_Discount = "Invoic_Discount";
	public static final String Contract_Po_Number = "contract_Po_Number";
	public static final String Contact_Name = "Contact_Name";
	public static final String Project_Name = "Project_Name";
	public static final String Invoice_Amount = "Invoice_Amount";
	public static final String Due_Amount = "Due_Amount";
	public static final String Sender_Name = "Sender_Name";
	public static final String Company_Name = "Company_Name";

	public Map<String, String> getInvoiceEmailParamMap() {

		Map<String, String> dataMap = new HashMap<String, String>();
		dataMap.put(Invoice_Reference_Number, "{invoicingReferencePattern}");
		dataMap.put(Invoice_Date, "{invoiceDate}");
		dataMap.put(Invoice_Due_Date, "{invoiceDueDate}");
		dataMap.put(Invoic_Discount, "{invoiceDiscount}");
		dataMap.put(Contract_Po_Number, "{contractPoNumber}");
		dataMap.put(Contact_Name, "{contactName}");
		dataMap.put(Project_Name, "{projectName}");
		dataMap.put(Invoice_Amount, "{invoiceAmount}");
		dataMap.put(Due_Amount, "{dueAmount}	");
		dataMap.put(Sender_Name, "{senderName}");
		dataMap.put(Company_Name, "{companyName}");

		return dataMap;
	}

}
