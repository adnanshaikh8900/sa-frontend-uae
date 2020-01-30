/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

/**
 *
 * @author sonu
 */
@Data
public class TransactionViewModel implements Serializable {

//    private LocalDateTime transactionDate;
//    private String transactionDescription;
//    private BigDecimal transactionAmount;
//    private TransactionType transactionType;
//    private TransactionCategory explainedTransactionCategory;
//    private BankAccount bankAccount;
//    private Project project;
//    private String receiptNumber;
//    private String attachementDescription;

	/**
	 * @author Saurabh
	 * 
	 */
	private Integer id;
	private String transactionDate;
	private String referenceNo;
	private String transactionTypeName;
	private Double depositeAmount;
	private Double withdrawalAmount;
	private Double runningAmount;

}
