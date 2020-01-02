/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.simplevat.rest.transactionimportcontroller;

import com.simplevat.utils.DateFormatUtil;
import com.simplevat.contact.model.Transaction;
import com.simplevat.contact.model.FileModel;
import com.simplevat.constant.TransactionCreditDebitConstant;
import com.simplevat.constant.TransactionEntryTypeConstant;
import com.simplevat.constant.TransactionStatusConstant;
import com.simplevat.entity.User;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.service.UserService;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.bankaccount.TransactionService;
import com.simplevat.service.bankaccount.TransactionStatusService;
import com.simplevat.service.bankaccount.TransactionTypeService;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Sonu
 */
@RestController
@RequestMapping(value = "/rest/transactionimport")
public class TransactionImportController implements Serializable {

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionTypeService transactionTypeService;

    @Autowired
    private TransactionStatusService transactionStatusService;

    @Autowired
    private UserService userServiceNew;

    private String transactionDate = "Transaction Date";

    private String description = "Description";

    private String debitAmount = "Debit Amount";

    private String creditAmount = "Credit Amount";
    private List<Transaction> selectedTransaction;
    private List<Transaction> creditTransaction = new ArrayList<>();
    private boolean transactionDateBoolean = false;
    private boolean descriptionBoolean = false;
    private List<Transaction> transactionList = new ArrayList<>();
    private List<Transaction> invalidTransactionList = new ArrayList<>();
    private boolean debitAmountBoolean = false;
    private boolean creditAmountBoolean = false;
    List<String> headerText = new ArrayList<String>();
    List<String> headerTextData = new ArrayList<String>();
    private boolean isDataRepeated = false;
    private boolean tableChange = true;
    Integer transcationDatePosition = -1;
    Integer transcationDescriptionPosition = -1;
    Integer transcationDebitPosition = -1;
    Integer transcationCreditPosition = -1;
    private List<String> invalidHeaderTransactionList = new ArrayList<>();
    private Integer totalErrorRows = 0;
    private boolean renderButtonOnValidData;
    private boolean headerIncluded = true;
    private Integer headerCount;
    private String dateFormat;

    @GetMapping(value = "/getbankaccountlist")
    public ResponseEntity<List<BankAccount>> getBankAccount() {
        List<BankAccount> bankAccounts = bankAccountService.getBankAccounts();
        if (bankAccounts != null) {
            return new ResponseEntity<>(bankAccounts, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/downloadcsv")
    public ResponseEntity<FileModel> downloadSimpleFile() {
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("excel-file/SampleTransaction.csv").getFile());
        FileModel fileModel = new FileModel();
        if (file.exists()) {
            String filepath = file.getAbsolutePath();
            fileModel.setFilePath(filepath);
            fileModel.setName("fileName");
            return new ResponseEntity<>(fileModel, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @GetMapping(value = "/getformatdate")
    public ResponseEntity<List<String>> getDateFormatList() {
        List<String> dateFormatList = DateFormatUtil.dateFormatList();
        if (dateFormatList != null) {
            return new ResponseEntity<>(dateFormatList, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public void handleFileUpload(@ModelAttribute("modelCircular") MultipartFile fileattached) {
        List<CSVRecord> listParser = new ArrayList<>();
        transactionDate = "Transaction Date";
        description = "Description";
        debitAmount = "Debit Amount";
        creditAmount = "Credit Amount";
        try {
            InputStream inputStream = fileattached.getInputStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            CSVParser parser = new CSVParser(br, CSVFormat.EXCEL);
            listParser = parser.getRecords();
        } catch (IOException e) {
            e.printStackTrace();
        }
        populateTranscationOnFileUpload(listParser);
    }

    public void populateTranscationOnFileUpload(List<CSVRecord> listParser) {
        headerText.clear();
        headerTextData.clear();
        transactionList.clear();
        creditTransaction.clear();
        invalidHeaderTransactionList.clear();
        totalErrorRows = 0;
        renderButtonOnValidData = true;
        isDataRepeated = false;
        String message = null;
        Integer headerValue = 0;
        getHeaderListData();
        Set<String> setToReturn = new HashSet<>();
        for (String name : headerTextData) {
            if (!setToReturn.add(name)) {
                // your duplicate element
                isDataRepeated = true;
                break;
            }
        }

        try {
            if (listParser != null) {
                int recordNo = 0;
                int headerIndex = 0;
                Integer header;
                Integer headerIndexPosition = 0;
                Integer headerIndexPositionCounter = 0;

                for (CSVRecord cSVRecord : listParser) {
                    if (headerIncluded) {
                        header = headerCount + 1;
                        headerIndexPosition = header;
                        headerValue = 1;
                    } else {
                        header = headerCount;
                        headerIndexPosition = header;
                        headerValue = 0;
                    }
                    if (headerIndexPosition.equals(header)) {
                        if (headerIndexPositionCounter == header - headerValue) {
                            int i = 0;
                            boolean isDataPresent = true;
                            while (isDataPresent) {
                                try {
                                    if (tableChange) {
                                        if (cSVRecord.get(i).equals(transactionDate)) {
                                            transactionDateBoolean = true;
                                            transcationDatePosition = i;
                                        } else if (cSVRecord.get(i).equals(description)) {
                                            descriptionBoolean = true;
                                            transcationDescriptionPosition = i;
                                        } else if (cSVRecord.get(i).equals(debitAmount)) {
                                            debitAmountBoolean = true;
                                            transcationDebitPosition = i;
                                        } else if (cSVRecord.get(i).equals(creditAmount)) {
                                            creditAmountBoolean = true;
                                            transcationCreditPosition = i;
                                        }
                                    }
                                    headerText.add(cSVRecord.get(i));
                                    i = i + 1;
                                } catch (Exception e) {
                                    isDataPresent = false;
                                }
                            }

                            headerIndexPosition++;
                            if (isDataRepeated) {
                                message = "Column mapping cannot be repeated";
                                break;
                            }
                            if (!transactionDateBoolean && !descriptionBoolean && !debitAmountBoolean && !creditAmountBoolean) {
                                break;
                            }
                        }
                        headerIndexPositionCounter++;
                    }

                    if (headerIndex < header) {
                        headerIndex++;
                    } else {
                        Transaction transaction = new Transaction();
                        transaction.setId(++recordNo);
                        int i = 0;
                        String date = cSVRecord.get(transcationDatePosition);
                        String description = cSVRecord.get(transcationDescriptionPosition);
                        String drAmount = cSVRecord.get(transcationDebitPosition);
                        String crAmount = cSVRecord.get(transcationCreditPosition);

                        try {
                            transaction.setDate("date");
                            TemporalAccessor ta = DateTimeFormatter.ofPattern(dateFormat).parse(date);
                            DateFormat formatter = new SimpleDateFormat(dateFormat, Locale.US);
                            Date dateTranscation = (Date) formatter.parse(date);
                            LocalDateTime transactionDate = Instant.ofEpochMilli(dateTranscation.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime();
                            DateFormat df = new SimpleDateFormat(dateFormat);
                            String reportDate = df.format(dateTranscation);
                            transaction.setDate("");
                            if (!drAmount.isEmpty()) {
                                transaction.setDebit("debit");
                                new BigDecimal(Float.valueOf(drAmount));
                                transaction.setDebit("");
                            }
                            if (!crAmount.isEmpty()) {
                                transaction.setCredit("credit");
                                new BigDecimal(Float.valueOf(crAmount));
                                transaction.setCredit("");
                            }
                            transaction.setTransactionDate(date);
                            transaction.setDescription(description);
                            transaction.setDrAmount(drAmount);
                            transaction.setCrAmount(crAmount);
                            transaction.setValidData(Boolean.TRUE);
                            transaction.setFormat(TransactionStatusConstant.VALID);
                            transactionList.add(transaction);
                        } catch (Exception e) {
                            totalErrorRows = totalErrorRows + 1;
                            transaction.setTransactionDate(date);
                            transaction.setDescription(description);
                            transaction.setDrAmount(drAmount);
                            transaction.setCrAmount(crAmount);
                            transaction.setValidData(Boolean.FALSE);
                            transaction.setFormat(TransactionStatusConstant.INVALID);
                            transactionList.add(transaction);
                            renderButtonOnValidData = false;
                        }

                        if (transaction.getCrAmount() != null && !transaction.getCrAmount().trim().isEmpty()) {
                            creditTransaction.add(transaction);
                        }
                    }
                }
                if (transactionDateBoolean && descriptionBoolean && debitAmountBoolean && creditAmountBoolean) {
                    transactionDateBoolean = false;
                    descriptionBoolean = false;
                    debitAmountBoolean = false;
                    creditAmountBoolean = false;

                }

                if (!invalidHeaderTransactionList.isEmpty()) {
                    StringBuilder validationMessage = new StringBuilder("Heading mismatch  ");
                    for (String invalidHeading : invalidHeaderTransactionList) {
                        validationMessage.append(invalidHeading).append("  ");
                    }
//                    validationMessage.append(" heading should be (" + TransactionStatusConstant.TRANSACTION_DATE + "," + TransactionStatusConstant.DESCRIPTION + "," + TransactionStatusConstant.DEBIT_AMOUNT + "," + TransactionStatusConstant.CREDIT_AMOUNT + ")");
//                    FacesMessage message = new FacesMessage(validationMessage.toString());
//                    message.setSeverity(FacesMessage.SEVERITY_ERROR);
//                    FacesContext.getCurrentInstance().addMessage("validationId", message);
                }

            }
        } catch (Exception ex) {
            Logger.getLogger(TransactionImportController.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void getHeaderListData() {
        headerTextData.add(transactionDate);
        headerTextData.add(description);
        headerTextData.add(debitAmount);
        headerTextData.add(creditAmount);
    }

    @PostMapping(value = "/saveimporttransaction")
    public ResponseEntity<Integer> saveTransactions(@RequestBody List<Transaction> transactionList, @RequestParam(value = "id") Integer id, @RequestParam(value = "bankId") Integer bankId) {
        for (Transaction transaction : transactionList) {
            save(transaction, id, bankId);
        }
        return new ResponseEntity<>(bankId, HttpStatus.OK);
    }

    private void save(Transaction transaction, Integer id, Integer bankId) {
        System.out.println("transaction===" + transaction);
        try {
            User loggedInUser = userServiceNew.findByPK(id);
            com.simplevat.entity.bankaccount.Transaction transaction1 = new com.simplevat.entity.bankaccount.Transaction();
            transaction1.setLastUpdateBy(loggedInUser.getUserId());
            transaction1.setCreatedBy(loggedInUser.getUserId());
            BankAccount bankAccount = bankAccountService.findByPK(bankId);
            transaction1.setBankAccount(bankAccount);
            transaction1.setEntryType(TransactionEntryTypeConstant.IMPORT);
            transaction1.setTransactionDescription(transaction.getDescription());
            LocalDate date = LocalDate.parse(transaction.getTransactionDate(), DateTimeFormatter.ofPattern("M/d/yyyy"));
            LocalTime time = LocalTime.now();
            transaction1.setTransactionDate(LocalDateTime.of(date, time));
            if (transaction.getDrAmount() != null && !transaction.getDrAmount().trim().isEmpty()) {
                transaction1.setTransactionAmount(BigDecimal.valueOf(Double.parseDouble(transaction.getDrAmount().replaceAll(",", ""))));
                transaction1.setDebitCreditFlag(TransactionCreditDebitConstant.DEBIT);
            }
            if (transaction.getCrAmount() != null && !transaction.getCrAmount().trim().isEmpty()) {
                transaction1.setTransactionAmount(BigDecimal.valueOf(Double.parseDouble(transaction.getCrAmount().replaceAll(",", ""))));
                transaction1.setDebitCreditFlag(TransactionCreditDebitConstant.CREDIT);
            }
            transaction1.setTransactionStatus(transactionStatusService.findByPK(TransactionStatusConstant.UNEXPLAINED));
            transactionService.persist(transaction1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
