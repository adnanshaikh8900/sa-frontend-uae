/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.expenses;

import com.simplevat.contact.model.ExpenseItemModel;
import com.simplevat.entity.Contact;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Data;
import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author daynil
 */
@Data
public class ExpenseRestModel {

    private Integer expenseId;
    private BigDecimal expenseAmount;
    private Date expenseDate;
    private String expenseDescription;
    private String receiptNumber;
    private Integer user;
    private Integer transactionType;
    private Integer transactionCategory;
    private Integer currency;
    private Integer project;
    private String receiptAttachmentPath;
    private String receiptAttachmentDescription;
    private Integer createdBy;
    private LocalDateTime createdDate;
    private Integer lastUpdatedBy;
    private LocalDateTime lastUpdateDate;
    private boolean deleteFlag = false;
    private MultipartFile attachmentFile;
    private String receiptAttachmentName;
    private String receiptAttachmentContentType;
//    private StreamedContent attachmentFileContent;
    private Integer versionNumber;
    private Integer paymentMode;
    private byte[] receiptAttachmentBinary;
    private List<ExpenseItemModel> expenseItem;
    private Contact expenseContact;
    private BigDecimal expenseSubtotal;
    private BigDecimal expenseVATAmount;
    private BigDecimal expenseAmountCompanyCurrency;
    private Integer flagView;
    private Integer userId;
    private Integer companyId;
    private Integer currencyCode;
    private BigDecimal totalAmount;
    private Integer bankAccountId;
    private Integer expenseContactId;
    private Integer paymentId;
    private BigDecimal vat;

    public void addExpenseItem(@NonNull final ExpenseItemModel expenseItemModel) {
        if (null == this.expenseItem) {
            expenseItem = new ArrayList<>();
        }
        expenseItem.add(expenseItemModel);
    }
}
