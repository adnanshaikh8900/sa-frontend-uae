/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactioncontroller;

import java.io.Serializable;

import lombok.Data;

/**
 * @author Saurabh
 * 
 */
@Data
public class TransactionViewModel implements Serializable {

	private Integer id;
	private String transactionDate;
	private String referenceNo;
	private String transactionTypeName;
	private Double depositeAmount;
	private Double withdrawalAmount;
	private Double runningAmount;
	private Character debitCreditFlag;
}
