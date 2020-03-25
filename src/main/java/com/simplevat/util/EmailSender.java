package com.simplevat.util;

import org.springframework.stereotype.Component;

import com.simplevat.constant.EmailConstant;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import javax.mail.internet.AddressException;

/**
 *
 * @author S@urabh
 */
@Component
public class EmailSender {

	public void send(String recipients, String subject, String content, String from, boolean html)
			throws AddressException, MessagingException {

		final String username = "saurabh.gaikwad@daynilgroup.com";
		final String password = "saurabh......";

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "465");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.socketFactory.port", "465");
		prop.put("mail.smtp.starttls.enable prop", "true");
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

		Session session;
		session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(from));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipients));
			message.setSubject(subject);
			if (!html) {
				message.setText(content);
			} else {
				message.setContent(content, "text/html");
			}
			Transport.send(message);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) throws MessagingException {
		EmailSender emailSender = new EmailSender();
		emailSender.send("gaikwad.saurabh66@gmail.com", "Subject", resetPassword,
				EmailConstant.ADMIN_SUPPORT_EMAIL, true);
	}

	public final static String resetPassword = "<!DOCTYPE html>\r\n" + 
			"<html>\r\n" + 
			"<head>\r\n" + 
			"\r\n" + 
			"  <meta charset=\"utf-8\">\r\n" + 
			"  <meta http-equiv=\"x-ua-compatible\" content=\"ie=edge\">\r\n" + 
			"  <title>Password Reset</title>\r\n" + 
			"  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n" + 
			"  <style type=\"text/css\">\r\n" + 
			"  /**\r\n" + 
			"   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.\r\n" + 
			"   */\r\n" + 
			"  @media screen {\r\n" + 
			"    @font-face {\r\n" + 
			"      font-family: 'Source Sans Pro';\r\n" + 
			"      font-style: normal;\r\n" + 
			"      font-weight: 400;\r\n" + 
			"      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');\r\n" + 
			"    }\r\n" + 
			"\r\n" + 
			"    @font-face {\r\n" + 
			"      font-family: 'Source Sans Pro';\r\n" + 
			"      font-style: normal;\r\n" + 
			"      font-weight: 700;\r\n" + 
			"      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');\r\n" + 
			"    }\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Avoid browser level font resizing.\r\n" + 
			"   * 1. Windows Mobile\r\n" + 
			"   * 2. iOS / OSX\r\n" + 
			"   */\r\n" + 
			"  body,\r\n" + 
			"  table,\r\n" + 
			"  td,\r\n" + 
			"  a {\r\n" + 
			"    -ms-text-size-adjust: 100%; /* 1 */\r\n" + 
			"    -webkit-text-size-adjust: 100%; /* 2 */\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Remove extra space added to tables and cells in Outlook.\r\n" + 
			"   */\r\n" + 
			"  table,\r\n" + 
			"  td {\r\n" + 
			"    mso-table-rspace: 0pt;\r\n" + 
			"    mso-table-lspace: 0pt;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Better fluid images in Internet Explorer.\r\n" + 
			"   */\r\n" + 
			"  img {\r\n" + 
			"    -ms-interpolation-mode: bicubic;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Remove blue links for iOS devices.\r\n" + 
			"   */\r\n" + 
			"  a[x-apple-data-detectors] {\r\n" + 
			"    font-family: inherit !important;\r\n" + 
			"    font-size: inherit !important;\r\n" + 
			"    font-weight: inherit !important;\r\n" + 
			"    line-height: inherit !important;\r\n" + 
			"    color: inherit !important;\r\n" + 
			"    text-decoration: none !important;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Fix centering issues in Android 4.4.\r\n" + 
			"   */\r\n" + 
			"  div[style*=\"margin: 16px 0;\"] {\r\n" + 
			"    margin: 0 !important;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  body {\r\n" + 
			"    width: 100% !important;\r\n" + 
			"    height: 100% !important;\r\n" + 
			"    padding: 0 !important;\r\n" + 
			"    margin: 0 !important;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  /**\r\n" + 
			"   * Collapse table borders to avoid space between cells.\r\n" + 
			"   */\r\n" + 
			"  table {\r\n" + 
			"    border-collapse: collapse !important;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  a {\r\n" + 
			"    color: #1a82e2;\r\n" + 
			"  }\r\n" + 
			"\r\n" + 
			"  img {\r\n" + 
			"    height: auto;\r\n" + 
			"    line-height: 100%;\r\n" + 
			"    text-decoration: none;\r\n" + 
			"    border: 0;\r\n" + 
			"    outline: none;\r\n" + 
			"  }\r\n" + 
			"  </style>\r\n" + 
			"\r\n" + 
			"</head>\r\n" + 
			"<body style=\"background-color: #e9ecef;\">\r\n" + 
			"\r\n" + 
			"  <!-- start preheader -->\r\n" + 
			"  <div class=\"preheader\" style=\"display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;\">\r\n" + 
			"    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.\r\n" + 
			"  </div>\r\n" + 
			"  <!-- end preheader -->\r\n" + 
			"\r\n" + 
			"  <!-- start body -->\r\n" + 
			"  <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n" + 
			"\r\n" + 
			"    <!-- start logo -->\r\n" + 
			"    <tr>\r\n" + 
			"      <td align=\"center\" bgcolor=\"#e9ecef\">\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\r\n" + 
			"        <tr>\r\n" + 
			"        <td align=\"center\" valign=\"top\" width=\"600\">\r\n" + 
			"        <![endif]-->\r\n" + 
			"        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\r\n" + 
			"          <tr>\r\n" + 
			"            <td align=\"center\" valign=\"top\" style=\"padding: 36px 24px;\">\r\n" + 
			"              <a href=\"http://k8s.dev.simplevat.com\" target=\"_blank\" style=\"display: inline-block;\">\r\n" + 
			"                <img src=\"http://k8s.dev.simplevat.com/static/media/logo.da6535df.png\" alt=\"Logo\" border=\"0\" width=\"60%\" style=\"display: block;\">\r\n" + 
			"              </a>\r\n" + 
			"            </td>\r\n" + 
			"          </tr>\r\n" + 
			"        </table>\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        </td>\r\n" + 
			"        </tr>\r\n" + 
			"        </table>\r\n" + 
			"        <![endif]-->\r\n" + 
			"      </td>\r\n" + 
			"    </tr>\r\n" + 
			"    <!-- end logo -->\r\n" + 
			"\r\n" + 
			"    <!-- start hero -->\r\n" + 
			"    <tr>\r\n" + 
			"      <td align=\"center\" bgcolor=\"#e9ecef\">\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\r\n" + 
			"        <tr>\r\n" + 
			"        <td align=\"center\" valign=\"top\" width=\"600\">\r\n" + 
			"        <![endif]-->\r\n" + 
			"        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\r\n" + 
			"          <tr>\r\n" + 
			"            <td align=\"left\" bgcolor=\"#ffffff\" style=\"padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;\">\r\n" + 
			"              <h1 style=\"margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;\">Reset Your Password</h1>\r\n" + 
			"            </td>\r\n" + 
			"          </tr>\r\n" + 
			"        </table>\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        </td>\r\n" + 
			"        </tr>\r\n" + 
			"        </table>\r\n" + 
			"        <![endif]-->\r\n" + 
			"      </td>\r\n" + 
			"    </tr>\r\n" + 
			"    <!-- end hero -->\r\n" + 
			"\r\n" + 
			"    <!-- start copy block -->\r\n" + 
			"    <tr>\r\n" + 
			"      <td align=\"center\" bgcolor=\"#e9ecef\">\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\">\r\n" + 
			"        <tr>\r\n" + 
			"        <td align=\"center\" valign=\"top\" width=\"600\">\r\n" + 
			"        <![endif]-->\r\n" + 
			"        <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">\r\n" + 
			"\r\n" + 
			"          <!-- start copy -->\r\n" + 
			"          <tr>\r\n" + 
			"            <td align=\"left\" bgcolor=\"#ffffff\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\">\r\n" + 
			"              <p style=\"margin: 0;\">Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.</p>\r\n" + 
			"            </td>\r\n" + 
			"          </tr>\r\n" + 
			"          <!-- end copy -->\r\n" + 
			"\r\n" + 
			"          <!-- start button -->\r\n" + 
			"          <tr>\r\n" + 
			"            <td align=\"left\" bgcolor=\"#ffffff\">\r\n" + 
			"              <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n" + 
			"                <tr>\r\n" + 
			"                  <td align=\"center\" bgcolor=\"#ffffff\" style=\"padding: 12px;\">\r\n" + 
			"                    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n" + 
			"                      <tr>\r\n" + 
			"                        <td align=\"center\" bgcolor=\"#1a82e2\" style=\"border-radius: 6px;\">\r\n" + 
			"                          <a href=\"LINK\" target=\"_blank\" style=\"display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;\">Click to reset Password</a>\r\n" + 
			"                        </td>\r\n" + 
			"                      </tr>\r\n" + 
			"                    </table>\r\n" + 
			"                  </td>\r\n" + 
			"                </tr>\r\n" + 
			"              </table>\r\n" + 
			"            </td>\r\n" + 
			"          </tr>\r\n" + 
			"          <!-- end button -->\r\n" + 
			"\r\n" + 
			"          <!-- start copy -->\r\n" + 
			"          <tr>\r\n" + 
			"            <td align=\"left\" bgcolor=\"#ffffff\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\">\r\n" + 
			"              <p style=\"margin: 0;\">If that doesn't work, copy and paste the following link in your browser:</p>\r\n" + 
			"              <p style=\"margin: 0;\"><a href=\"LINK\" target=\"_blank\">LINK</a></p>\r\n" + 
			"            </td>\r\n" + 
			"          </tr>\r\n" + 
			"          <!-- end copy -->\r\n" + 
			"\r\n" + 
			"        </table>\r\n" + 
			"        <!--[if (gte mso 9)|(IE)]>\r\n" + 
			"        </td>\r\n" + 
			"        </tr>\r\n" + 
			"        </table>\r\n" + 
			"        <![endif]-->\r\n" + 
			"      </td>\r\n" + 
			"    </tr>\r\n" + 
			"    <!-- end copy block -->\r\n" + 
			"\r\n" + 
			"  </table>\r\n" + 
			"  <!-- end body -->\r\n" + 
			"\r\n" + 
			"</body>\r\n" + 
			"</html>"; 
}
