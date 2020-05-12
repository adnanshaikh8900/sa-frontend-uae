package com.simplevat.rest.journalcontroller;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.User;
import com.simplevat.rest.PaginationResponseModel;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;

@Component
public class JournalRestHelper {
	private final Logger logger = LoggerFactory.getLogger(JournalRestHelper.class);
	private static final boolean isList = true;
	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private JournalService journalService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private UserService userService;

	@Autowired
	private VatCategoryService vatCategoryService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	@Autowired
	private JournalLineItemService journalLineItemService;

	public Journal getEntity(JournalRequestModel journalRequestModel, Integer userId) {
		Journal journal = new Journal();
		if (journalRequestModel.getJournalId() != null) {
			journal = journalService.findByPK(journalRequestModel.getJournalId());
			if (journal.getJournalLineItems() != null) {
				journalLineItemService.deleteByJournalId(journalRequestModel.getJournalId());
			}
		}
		if (journalRequestModel.getCurrencyCode() != null) {
			journal.setCurrency(currencyService.getCurrency(journalRequestModel.getCurrencyCode()));
		}
		journal.setJournlReferencenNo(journalRequestModel.getJournalReferenceNo());
		if (journalRequestModel.getJournalDate() != null) {
			LocalDateTime journalDate = Instant.ofEpochMilli(journalRequestModel.getJournalDate().getTime())
					.atZone(ZoneId.systemDefault()).withHour(0).withMinute(0).withSecond(0).withNano(0)
					.toLocalDateTime();
			journal.setJournalDate(journalDate);
		}
		journal.setDescription(journalRequestModel.getDescription());
		if (journalRequestModel.getSubTotalCreditAmount() != null) {
			journal.setSubTotalCreditAmount(journalRequestModel.getSubTotalCreditAmount());
		}
		if (journalRequestModel.getSubTotalDebitAmount() != null) {
			journal.setSubTotalDebitAmount(journalRequestModel.getSubTotalDebitAmount());
		}
		if (journalRequestModel.getTotalCreditAmount() != null) {
			journal.setTotalCreditAmount(journalRequestModel.getTotalCreditAmount());
		}
		if (journalRequestModel.getTotalDebitAmount() != null) {
			journal.setTotalDebitAmount(journalRequestModel.getTotalDebitAmount());
		}

		if (journalRequestModel.getJournalLineItems() != null && !journalRequestModel.getJournalLineItems().isEmpty()) {
			List<JournalLineItemRequestModel> itemModels = journalRequestModel.getJournalLineItems();
			if (!itemModels.isEmpty()) {
				List<JournalLineItem> lineItems = getLineItems(itemModels, journal, userId);
				journal.setJournalLineItems(!lineItems.isEmpty() ? lineItems : null);
			}
		}
		return journal;
	}

	public List<JournalLineItem> getLineItems(List<JournalLineItemRequestModel> itemModels, Journal journal,
			Integer userId) {
		List<JournalLineItem> lineItems = new ArrayList<>();
		for (JournalLineItemRequestModel model : itemModels) {
			try {
				JournalLineItem lineItem = new JournalLineItem();
				if (model.getId() != null) {
					lineItem = journalLineItemService.findByPK(model.getId());
					lineItem.setLastUpdateBy(userId);
					lineItem.setLastUpdateDate(LocalDateTime.now());
				} else {
					lineItem.setCreatedBy(userId);
					lineItem.setCreatedDate(LocalDateTime.now());
					lineItem.setDeleteFlag(false);
				}
				lineItem.setDescription(model.getDescription());
				if (model.getContactId() != null) {
					lineItem.setContact(contactService.findByPK(model.getContactId()));
				}
				if (model.getVatCategoryId() != null) {
					lineItem.setVatCategory(vatCategoryService.findByPK(model.getVatCategoryId()));
				}
				if (model.getCreditAmount() != null) {
					lineItem.setCreditAmount(model.getCreditAmount());
				}
				lineItem.setDebitAmount(model.getDebitAmount());

				if (model.getTransactionCategoryId() != null) {
					lineItem.setTransactionCategory(
							transactionCategoryService.findByPK(model.getTransactionCategoryId()));
				}
				lineItem.setJournal(journal);
				lineItem.setReferenceId(journal.getId());
				lineItem.setReferenceType(lineItem.getReferenceType() != null ? lineItem.getReferenceType()
						: PostingReferenceTypeEnum.MANUAL);

				lineItems.add(lineItem);
			} catch (Exception e) {
				logger.error("Error", e);
				return new ArrayList<>();
			}
		}
		return lineItems;
	}

	public PaginationResponseModel getListModel(PaginationResponseModel responseModel) {

		if (responseModel != null) {

			List<JournalModel> journalModelList = new ArrayList<>();
			if (responseModel.getData() != null) {
				for (Journal journal : (List<Journal>) responseModel.getData()) {
					journalModelList.add(getModel(journal, isList));
				}
				responseModel.setData(journalModelList);
				return responseModel;
			}
		}
		return null;
	}

	public JournalModel getModel(Journal journal, boolean list) {

		boolean isManual = journal.getPostingReferenceType().equals(PostingReferenceTypeEnum.MANUAL);

		JournalModel model = new JournalModel();
		model.setJournalId(journal.getId());
		model.setDescription(journal.getDescription());
		model.setJournalReferenceNo(isManual ? journal.getJournlReferencenNo() : " ");

		BigDecimal totalCreditAmount = getTotalCreditAmount(journal.getJournalLineItems());
		BigDecimal totalDebitAmount = getTotalDebitAmount(journal.getJournalLineItems());

		model.setSubTotalCreditAmount(isManual ? journal.getSubTotalCreditAmount() : totalCreditAmount);
		model.setSubTotalDebitAmount(isManual ? journal.getSubTotalDebitAmount() : totalDebitAmount);
		model.setTotalCreditAmount(isManual ? journal.getTotalCreditAmount() : totalCreditAmount);
		model.setTotalDebitAmount(isManual ? journal.getTotalDebitAmount() : totalDebitAmount);
		if (journal.getJournalDate() != null) {
			Date journalDate = Date.from(journal.getJournalDate().atZone(ZoneId.systemDefault()).toInstant());
			model.setJournalDate(journalDate);
		}
		if (journal.getCurrency() != null) {
			model.setCurrencyCode(journal.getCurrency().getCurrencyCode());
		}
		if (journal.getCreatedBy() != null) {
			User user = userService.findByPK(journal.getCreatedBy());
			if (user != null) {
				model.setCreatedByName(user.getFirstName() + " " + user.getLastName());
			}
		}
		model.setPostingReferenceType(journal.getPostingReferenceType());
		model.setPostingReferenceTypeDisplayName(journal.getPostingReferenceType().getDisplayName());
		List<JournalLineItemRequestModel> requestModels = new ArrayList<>();
		if (journal.getJournalLineItems() != null && !journal.getJournalLineItems().isEmpty()) {
			for (JournalLineItem lineItem : journal.getJournalLineItems()) {
				JournalLineItemRequestModel requestModel = getLineItemModel(lineItem, list);
				requestModels.add(requestModel);
			}
			model.setJournalLineItems(requestModels);
		}
		return model;
	}

	public JournalLineItemRequestModel getLineItemModel(JournalLineItem lineItem, boolean list) {
		JournalLineItemRequestModel requestModel = new JournalLineItemRequestModel();
		requestModel.setId(lineItem.getId());
		if (lineItem.getContact() != null) {
			requestModel.setContactId(lineItem.getContact().getContactId());
		}
		if (lineItem.getTransactionCategory() != null) {
			requestModel.setTransactionCategoryId(lineItem.getTransactionCategory().getTransactionCategoryId());
			requestModel.setTransactionCategoryName(lineItem.getTransactionCategory().getTransactionCategoryName());
		}
		BigDecimal creditVatAmt = BigDecimal.valueOf(0);
		BigDecimal debitVatAmt = BigDecimal.valueOf(0);

		if (lineItem.getVatCategory() != null) {
			requestModel.setVatCategoryId(lineItem.getVatCategory().getId());
			if (list && !lineItem.getVatCategory().getVat().equals(BigDecimal.valueOf(0))) {
				creditVatAmt = lineItem.getVatCategory().getVat().divide(BigDecimal.valueOf(100))
						.multiply(lineItem.getCreditAmount());
				debitVatAmt = lineItem.getVatCategory().getVat().divide(BigDecimal.valueOf(100))
						.multiply(lineItem.getDebitAmount());
			}
		}
		requestModel.setDescription(lineItem.getDescription());

		requestModel.setCreditAmount(lineItem.getCreditAmount() != null ? lineItem.getCreditAmount().add(creditVatAmt)
				: BigDecimal.valueOf(0));
		requestModel.setDebitAmount(
				lineItem.getDebitAmount() != null ? lineItem.getDebitAmount().add(debitVatAmt) : BigDecimal.valueOf(0));
		requestModel.setPostingReferenceType(lineItem.getReferenceType());
		return requestModel;
	}

	public Collection<JournalLineItem> setReferenceId(Collection<JournalLineItem> journalLineItemList, Integer id) {
		for (JournalLineItem journalLineItem : journalLineItemList) {
			journalLineItem.setReferenceId(id);
		}
		return journalLineItemList;
	}

	public BigDecimal getTotalDebitAmount(Collection<JournalLineItem> lineItem) {

		BigDecimal totalDebitAmount = BigDecimal.valueOf(0);
		if (lineItem != null && !lineItem.isEmpty()) {
			for (JournalLineItem item : lineItem) {
				if (item.getDebitAmount() != null) {
					totalDebitAmount = totalDebitAmount.add(item.getDebitAmount());
				}
			}
			return totalDebitAmount;
		}

		return totalDebitAmount;
	}

	public BigDecimal getTotalCreditAmount(Collection<JournalLineItem> lineItem) {

		BigDecimal totalCreditAmount = BigDecimal.valueOf(0);
		if (lineItem != null && !lineItem.isEmpty()) {
			for (JournalLineItem item : lineItem) {
				if (item.getCreditAmount() != null) {
					totalCreditAmount = totalCreditAmount.add(item.getCreditAmount());
				}
			}
			return totalCreditAmount;
		}

		return BigDecimal.valueOf(0);
	}

	public PaginationResponseModel getCsvListModel(PaginationResponseModel responseModel) {

		if (responseModel != null) {

			List<JournalCsvModel> journalModelList = new ArrayList<>();
			if (responseModel.getData() != null) {

				List<JournalLineItem> lineItemList = new ArrayList<>();
				Map<Integer, Journal> journalMap = new HashMap<>();
				for (Journal journal : (List<Journal>) responseModel.getData()) {
					for (JournalLineItem item : journal.getJournalLineItems()) {
						lineItemList.add(item);
						journalMap.put(item.getId(), journal);
					}
				}

				for (JournalLineItem lineItem : lineItemList) {
					JournalCsvModel model = new JournalCsvModel();
					Journal journal = journalMap.get(lineItem.getId());

					boolean isManual = journal.getPostingReferenceType().equals(PostingReferenceTypeEnum.MANUAL);

					model.setJournalReferenceNo(isManual ? journal.getJournlReferencenNo() : " ");

					if (journal.getJournalDate() != null) {
						Date journalDate = Date
								.from(journal.getJournalDate().atZone(ZoneId.systemDefault()).toInstant());
						model.setJournalDate(journalDate);
					}
					model.setPostingReferenceTypeDisplayName(journal.getPostingReferenceType().getDisplayName());

					if (lineItem.getTransactionCategory() != null) {
						model.setTransactionCategoryName(
								lineItem.getTransactionCategory().getTransactionCategoryName());
					}
					BigDecimal creditVatAmt = BigDecimal.ZERO;
					BigDecimal debitVatAmt = BigDecimal.ZERO;

					if (lineItem.getVatCategory() != null) {
						if (!lineItem.getVatCategory().getVat().equals(BigDecimal.valueOf(0))) {
							creditVatAmt = lineItem.getVatCategory().getVat().divide(BigDecimal.valueOf(100))
									.multiply(lineItem.getCreditAmount());
							debitVatAmt = lineItem.getVatCategory().getVat().divide(BigDecimal.valueOf(100))
									.multiply(lineItem.getDebitAmount());
						}
					}
					model.setDescription(lineItem.getDescription());

					model.setCreditAmount(
							lineItem.getCreditAmount() != null ? lineItem.getCreditAmount().add(creditVatAmt)
									: BigDecimal.valueOf(0));
					model.setDebitAmount(lineItem.getDebitAmount() != null ? lineItem.getDebitAmount().add(debitVatAmt)
							: BigDecimal.valueOf(0));
					responseModel.setData(journalModelList);
					journalModelList.add(model);
				}
				responseModel.setData(journalModelList);
			}

		}
		return responseModel;
	}
}
