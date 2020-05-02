package com.simplevat.rest.transactionimportcontroller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.MathContext;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

import com.simplevat.constant.TransactionCreationMode;
import com.simplevat.constant.TransactionStatusConstant;
import com.simplevat.model.TransactionModel;
import com.simplevat.criteria.enums.TransactionEnum;
import com.simplevat.dao.DateFormatDao;
import com.simplevat.dao.TransactionParsingSettingDao;
import com.simplevat.entity.bankaccount.BankAccount;
import com.simplevat.service.BankAccountService;
import com.simplevat.service.bankaccount.TransactionService;

@Component
public class TransactionImportRestHelper {
	private final Logger LOGGER = LoggerFactory.getLogger(TransactionImportRestHelper.class);

	private String transactionDate = "Transaction Date";

	private String description = "Description";

	private String debitAmount = "Debit Amount";

	private String creditAmount = "Credit Amount";
	private List<TransactionModel> selectedTransaction;
	private List<TransactionModel> creditTransaction = new ArrayList<>();
	private boolean transactionDateBoolean = false;
	private boolean descriptionBoolean = false;
	private List<TransactionModel> transactionList = new ArrayList<>();
	private List<TransactionModel> invalidTransactionList = new ArrayList<>();
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

	@Autowired
	private BankAccountService bankAccountService;

	@Autowired
	private DateFormatDao dateFormatDao;

	@Autowired
	private TransactionParsingSettingDao transactionParsingSettingDao;

	@Autowired
	private TransactionService transactionService;

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
			LOGGER.error("Error", e);
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
							if (!transactionDateBoolean && !descriptionBoolean && !debitAmountBoolean
									&& !creditAmountBoolean) {
								break;
							}
						}
						headerIndexPositionCounter++;
					}

					if (headerIndex < header) {
						headerIndex++;
					} else {
						TransactionModel transaction = new TransactionModel();
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
							LocalDateTime transactionDate = Instant.ofEpochMilli(dateTranscation.getTime())
									.atZone(ZoneId.systemDefault()).toLocalDateTime();
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
							transaction.setDebit(drAmount);
							transaction.setCredit(crAmount);
							transaction.setValidData(Boolean.TRUE);
							transaction.setFormat(TransactionStatusConstant.VALID);
							transactionList.add(transaction);
						} catch (Exception e) {
							totalErrorRows = totalErrorRows + 1;
							transaction.setTransactionDate(date);
							transaction.setDescription(description);
							transaction.setDebit(drAmount);
							transaction.setCredit(crAmount);
							transaction.setValidData(Boolean.FALSE);
							transaction.setFormat(TransactionStatusConstant.INVALID);
							transactionList.add(transaction);
							renderButtonOnValidData = false;
						}

						if (transaction.getCredit() != null && !transaction.getCredit().trim().isEmpty()) {
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
//	                    validationMessage.append(" heading should be (" + TransactionStatusConstant.TRANSACTION_DATE + "," + TransactionStatusConstant.DESCRIPTION + "," + TransactionStatusConstant.DEBIT_AMOUNT + "," + TransactionStatusConstant.CREDIT_AMOUNT + ")");
//	                    FacesMessage message = new FacesMessage(validationMessage.toString());
//	                    message.setSeverity(FacesMessage.SEVERITY_ERROR);
//	                    FacesContext.getCurrentInstance().addMessage("validationId", message);
				}

			}
		} catch (Exception ex) {
			LOGGER.error("Error", ex);
		}
	}

	private void getHeaderListData() {
		headerTextData.add(transactionDate);
		headerTextData.add(description);
		headerTextData.add(debitAmount);
		headerTextData.add(creditAmount);
	}

	public List<com.simplevat.entity.bankaccount.Transaction> getEntity(TransactionImportModel transactionImportModel) {

		if (transactionImportModel != null && transactionImportModel.getImportDataMap() != null
				&& !transactionImportModel.getImportDataMap().isEmpty()) {

			List<com.simplevat.entity.bankaccount.Transaction> transactions = new ArrayList<>();

			BankAccount bankAcc = bankAccountService.findByPK(transactionImportModel.getBankId());

			dateFormat = transactionParsingSettingDao.getDateFormatByTemplateId(transactionImportModel.getTemplateId());
			DateFormat formatter = new SimpleDateFormat(dateFormat);

			BigDecimal currentBalance = transactionService
					.getCurrentBalanceByBankId(transactionImportModel.getBankId());

			for (Map<String, Object> dataMap : transactionImportModel.getImportDataMap()) {
				com.simplevat.entity.bankaccount.Transaction trnx = new com.simplevat.entity.bankaccount.Transaction();
				trnx.setBankAccount(bankAcc);

				for (String dbColName : dataMap.keySet()) {

					TransactionEnum dbColEnum = TransactionEnum.getByDisplayName(dbColName);

					String data = (String) dataMap.get(dbColEnum.getDisplayName());
					switch (dbColEnum) {

					case CREDIT_DEBIT_FLAG:
						trnx.setDebitCreditFlag(data.charAt(0));
						break;

					case CR_AMOUNT:
					case DR_AMOUNT:
					case AMOUNT:

						MathContext mc = new MathContext(4); // 2 precision

						// need to create enum
						if (dataMap.containsKey(TransactionEnum.CREDIT_DEBIT_FLAG.getDisplayName())) {
							trnx.setTransactionAmount(new BigDecimal(Float.valueOf(data)));
							if (dataMap.get(TransactionEnum.CREDIT_DEBIT_FLAG.getDisplayName()).equals("C")) {
								currentBalance = currentBalance.add(trnx.getTransactionAmount(), mc);
							} else {
								currentBalance = currentBalance.subtract(trnx.getTransactionAmount(), mc);
							}
							trnx.setDebitCreditFlag(
									((String) dataMap.get(TransactionEnum.CREDIT_DEBIT_FLAG.getDisplayName()))
											.charAt(0));
						} else {
							if (dbColEnum.equals(TransactionEnum.DR_AMOUNT)) {
								data = (String) dataMap.get(TransactionEnum.DR_AMOUNT.getDisplayName());
								if (!data.equals("-")) {
									BigDecimal debitAmt = BigDecimal.valueOf((Float.valueOf(data)));
									if (debitAmt.compareTo(BigDecimal.ZERO) > 0) {
										trnx.setTransactionAmount(debitAmt);
										currentBalance = currentBalance.subtract(trnx.getTransactionAmount(), mc);
										trnx.setDebitCreditFlag('D');
									}
								}
							}
							if (dbColEnum.equals(TransactionEnum.CR_AMOUNT)) {
								data = (String) dataMap.get(TransactionEnum.CR_AMOUNT.getDisplayName());
								if (!data.equals("-")) {
									BigDecimal creditAmt = BigDecimal.valueOf(Float.valueOf(data));
									if (creditAmt.compareTo(BigDecimal.ZERO) > 0) {
										trnx.setTransactionAmount(creditAmt);
										currentBalance = currentBalance.add(trnx.getTransactionAmount(), mc);
										trnx.setDebitCreditFlag('C');
									}
								}
							}
						}

						trnx.setCurrentBalance(currentBalance);
						break;

					case DESCRIPTION:
						trnx.setTransactionDescription(data);
						break;

					case TRANSACTION_DATE:

						Date dateTranscation;
						try {
							dateTranscation = (Date) formatter.parse(data);
							LocalDateTime transactionDate = Instant.ofEpochMilli(dateTranscation.getTime())
									.atZone(ZoneId.systemDefault()).toLocalDateTime();
							trnx.setTransactionDate(transactionDate);
						} catch (ParseException e) {
							LOGGER.error("Error", e);
						}
						break;
					}
				}
				trnx.setCreatedBy(transactionImportModel.getCreatedBy());
				trnx.setCreatedDate(LocalDateTime.now());
				trnx.setCreationMode(TransactionCreationMode.IMPORT);
				transactions.add(trnx);
				System.out.println(trnx.toString());
			}

			return transactions;
		}
		return null;
	}
}
