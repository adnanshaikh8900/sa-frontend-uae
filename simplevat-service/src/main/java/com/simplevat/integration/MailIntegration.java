package com.simplevat.integration;

import com.simplevat.entity.Mail;
import com.simplevat.entity.MailAttachment;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Component;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMultipart;
import org.springframework.core.io.InputStreamSource;

/**
 * Created by Utkarsh Bhavsar on 28/05/17.
 */
@Component
public class MailIntegration {

    private static final String UTF_8 = "UTF-8";

    private final JavaMailSender mailSender;

    @Autowired
    public MailIntegration(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

//    private void sendEmail(final Mail mail, boolean html) throws Exception {
//
//        MimeMessagePreparator preparator = mimeMessage -> {
//            MimeMessageHelper mimeMessagePreparator = new MimeMessageHelper(mimeMessage, true, UTF_8);
//            mimeMessagePreparator.setTo(mail.getTo());
//            mimeMessagePreparator.setFrom(new InternetAddress(mail.getFrom(), mail.getFromName()));
//            mimeMessagePreparator.setText(mail.getBody(), html);
//            mimeMessagePreparator.setSubject(mail.getSubject());
//        };
//        mailSender.send(preparator);
//    }
    private void sendEmail(final Mail mail, List<MailAttachment> mailAttachmentList, JavaMailSender javaMailSender, boolean html) throws Exception {
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper mimeMessagePreparator = new MimeMessageHelper(mimeMessage, true, UTF_8);
            mimeMessagePreparator.setTo(mail.getTo());
            mimeMessagePreparator.setFrom(new InternetAddress(mail.getFrom(), mail.getFromName()));
            if (mail.getBcc() != null) {
                mimeMessagePreparator.setBcc(mail.getBcc());
            }
            if (mail.getCc() != null) {
                mimeMessagePreparator.setCc(mail.getCc());
            }
            mimeMessagePreparator.setText(mail.getBody(), html);
            mimeMessagePreparator.setSubject(mail.getSubject());
            if (mailAttachmentList != null && !mailAttachmentList.isEmpty()) {
                for (MailAttachment mailAttachment : mailAttachmentList) {
                    if (mailAttachment.getAttachmentObject() instanceof InputStreamSource) {
                        mimeMessagePreparator.addAttachment(mailAttachment.getAttachmentName(), (InputStreamSource) mailAttachment.getAttachmentObject());
                    }
                }
            }
        };
        javaMailSender.send(preparator);
    }

    private void sendEmail(final Mail mail, JavaMailSender javaMailSender, boolean html) throws Exception {

        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper mimeMessagePreparator = new MimeMessageHelper(mimeMessage, true, UTF_8);
            mimeMessagePreparator.setTo(mail.getTo());
            mimeMessagePreparator.setFrom(new InternetAddress(mail.getFrom(), mail.getFromName()));
            mimeMessagePreparator.setText(mail.getBody(), html);
            mimeMessagePreparator.setSubject(mail.getSubject());
        };
        javaMailSender.send(preparator);
    }

    public void sendHtmlEmail(final MimeMultipart mimeMultipart, final Mail mail, JavaMailSender javaMailSender) throws Exception {

        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper mimeMessagePreparator = new MimeMessageHelper(mimeMessage, true, UTF_8);
            mimeMessagePreparator.setTo(mail.getTo());
            mimeMessagePreparator.setFrom(new InternetAddress(mail.getFrom(), mail.getFromName()));
//            mimeMessagePreparator.setText(mail.getBody(), true);
            mimeMessagePreparator.setSubject(mail.getSubject());
            mimeMessagePreparator.getMimeMessage().setContent(mimeMultipart);
        };
        javaMailSender.send(preparator);
    }

//    public void sendHtmlMail(final Mail mail) throws Exception {
//        sendEmail(mail, true);
//    }
    public void sendHtmlMail(final Mail mail, List<MailAttachment> mailAttachmentList, JavaMailSender javaMailSender) throws Exception {
        sendEmail(mail, mailAttachmentList, javaMailSender, true);
    }

    public void sendHtmlMail(final Mail mail, JavaMailSender javaMailSender) throws Exception {
        sendEmail(mail, javaMailSender, true);
    }
}
