/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.utils;

import com.simplevat.constant.FileTypeEnum;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author admin
 */
@Component
public class FileHelper {

    @Value("${simplevat.filelocation}")
    private String fileLocation;

    private final String LOGO_IMAGE_PATH = "images/SimpleVatLogoFinalFinal.png";

    public String readFile(String fileName) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(fileName));
        try {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append("\n");
                line = br.readLine();
            }
            return sb.toString();
        } finally {
            br.close();
        }
    }

    public MimeMultipart getMessageBody(String htmlText) throws MessagingException {
        ClassLoader classLoader = getClass().getClassLoader();
        File file;
        if (classLoader.getResource(LOGO_IMAGE_PATH).getFile() != null) {
            file = new File(classLoader.getResource(LOGO_IMAGE_PATH).getFile());

            String logoImagePath = file.getAbsolutePath();
            // This mail has 2 part, the BODY and the embedded image
            MimeMultipart multipart = new MimeMultipart("related");

            // first part (the html)
            BodyPart messageBodyPart = new MimeBodyPart();

            messageBodyPart.setContent(htmlText, "text/html");
            // add it
            multipart.addBodyPart(messageBodyPart);

            // second part (the image)
            messageBodyPart = new MimeBodyPart();
            DataSource fds = new FileDataSource(logoImagePath);

            messageBodyPart.setDataHandler(new DataHandler(fds));
            messageBodyPart.setHeader("Content-ID", "<simplevatlogo>");

            // add image to the multipart
            multipart.addBodyPart(messageBodyPart);

            return multipart;
        }
        return new MimeMultipart();
    }

    public String saveFile(MultipartFile multipartFile, FileTypeEnum fileTypeEnum) throws IOException {
        String storagePath = fileLocation + File.separator;
        String fileName = getFileName(multipartFile, fileTypeEnum);
        File file = new File(storagePath + fileName);
        multipartFile.transferTo(file);
        return fileName;
    }

    public String getFileName(MultipartFile multipartFile, FileTypeEnum fileTypeEnum) {
        if (multipartFile.getOriginalFilename() != null) {
            String dateString = new SimpleDateFormat("yyyyMMdd").format(new Date());
            String fileExtension = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf(".") + 1);
            UUID uuid = UUID.randomUUID();
            String fileName = uuid.toString() + "." + fileExtension;
            switch (fileTypeEnum) {
                case EXPENSE:
                    return dateString + File.separator +"ex-" + fileName;
                case CUSTOMER_INVOICE:
                    return dateString + File.separator +"ci-" + fileName;
                case SUPPLIER_INVOICE:
                    return dateString + File.separator +"si-" + fileName;
                default:
                    return uuid.toString();
            }
        }
        return null;
    }

}
