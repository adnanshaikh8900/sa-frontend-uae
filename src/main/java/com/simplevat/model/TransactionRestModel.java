package com.simplevat.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import com.simplevat.entity.Project;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.entity.bankaccount.Transaction;
import com.simplevat.entity.bankaccount.TransactionCategory;
import com.simplevat.entity.bankaccount.TransactionStatus;
import com.simplevat.entity.bankaccount.TransactionType;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TransactionRestModel implements Comparable<TransactionRestModel> {

    private Integer transactionId;
    private Date transactionDate;
    private String transactionDescription;
    private BigDecimal transactionAmount;
    private TransactionType transactionType;
    private String receiptNumber;
    private Character debitCreditFlag;
    private Project project;
    private TransactionCategory explainedTransactionCategory;
    private String explainedTransactionDescription;
    private String explainedTransactionAttachementDescription;
    private byte[] explainedTransactionAttachement;
    private BankAccount bankAccount;
    private TransactionStatus transactionStatus;
    private BigDecimal currentBalance = new BigDecimal(0);
    private Integer createdBy;
    private LocalDateTime createdDate;
    private Integer lastUpdatedBy;
    private LocalDateTime lastUpdateDate;
    private Boolean deleteFlag = false;
//    private UploadedFile attachmentFile;
//    private StreamedContent attachmentFileContent;
    private Integer versionNumber;
    private Integer entryType;
    private Object refObject;
    private Integer referenceId;
    private Integer referenceType;
    private String referenceName;
    private String referenceTypeName;
    private Transaction parentTransaction;
    private List<TransactionRestModel> childTransactionList = new ArrayList<>();
    private boolean expandIcon;
    private String suggestedTransactionString;

    @Override
    public int compareTo(TransactionRestModel o) {
        return transactionDate.compareTo(o.transactionDate);
    }

    public boolean isParent() {
        return parentTransaction == null;
    }

}
