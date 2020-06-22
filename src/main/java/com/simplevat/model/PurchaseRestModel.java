/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.model;

import com.simplevat.entity.Contact;
import com.simplevat.entity.Currency;
import com.simplevat.entity.Project;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.ChartOfAccount;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import lombok.Data;
import org.springframework.lang.NonNull;

/**
 *
 * @author daynil
 */
@Data
public class PurchaseRestModel {

	private static final long serialVersionUID = 1L;

	private Integer purchaseId;
	private BigDecimal purchaseAmount;
	private BigDecimal purchaseDueAmount;
	private Date purchaseDate;
	private Date purchaseDueDate;
	private Integer purchaseDueOn;
	private String purchaseDescription;
	private String receiptNumber;
	private User user;
	private ChartOfAccount transactionType;
	private TransactionCategory transactionCategory;
	private Currency currency;
	private Project project;
	private String receiptAttachmentPath;
	private String receiptAttachmentDescription;
	private Integer createdBy;
	private LocalDateTime createdDate;
	private Integer lastUpdateBy;
	private LocalDateTime lastUpdateDate;
	private Boolean deleteFlag = Boolean.FALSE;
	private byte[] receiptAttachmentBinary;
	private List<PurchaseItemRestModel> purchaseItems;
	private Integer versionNumber;
	private Integer status;
	private String statusName;
	private Integer paymentMode;
	private Contact purchaseContact;
	private BigDecimal purchaseSubtotal;
	private BigDecimal purchaseVATAmount;

	public void addPurchaseItem(@NonNull final PurchaseItemRestModel purchaseItemModel) {
		if (null == this.purchaseItems) {
			purchaseItems = new ArrayList<>();
		}
		purchaseItems.add(purchaseItemModel);
	}
}
