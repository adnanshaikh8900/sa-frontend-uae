package com.simplevat.rest.journalcontroller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.PostingReferenceTypeEnum;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.entity.User;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.JournalLineItemService;
import com.simplevat.service.JournalService;
import com.simplevat.service.TransactionCategoryService;
import com.simplevat.service.UserService;
import com.simplevat.service.VatCategoryService;
import java.util.Collection;
import java.util.Date;

@Component
public class JournalRestHelper {

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
		journal.setReferenceCode(journalRequestModel.getReferenceCode());
		if (journalRequestModel.getJournalDate() != null) {
			LocalDateTime journalDate = Instant.ofEpochMilli(journalRequestModel.getJournalDate().getTime())
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
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
		List<JournalLineItemRequestModel> itemModels = new ArrayList<>();
		if (journalRequestModel.getJournalLineItems() != null && !journalRequestModel.getJournalLineItems().isEmpty()) {
			itemModels = journalRequestModel.getJournalLineItems();
			if (itemModels.size() > 0) {
				journal.setJournalLineItems(getLineItems(itemModels, journal, userId));
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
						: PostingReferenceTypeEnum.MUNUAL);

				lineItems.add(lineItem);
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		return lineItems;
	}

	public List<JournalModel> getListModel(List<Journal> journals) {

		if (journals != null && journals.size() > 0) {

			List<JournalModel> journalModelList = new ArrayList<JournalModel>();

			for (Journal journal : journals) {
				journalModelList.add(getModel(journal));
			}
			return journalModelList;
		}
		return null;
	}

	public JournalModel getModel(Journal journal) {
		JournalModel model = new JournalModel();
		// XXX: need to add attribute accordingly
		model.setJournalId(journal.getId());
		model.setDescription(journal.getDescription());
		model.setReferenceCode(journal.getReferenceCode());
		model.setSubTotalCreditAmount(journal.getSubTotalCreditAmount());
		model.setSubTotalDebitAmount(journal.getSubTotalDebitAmount());
		model.setTotalCreditAmount(journal.getTotalCreditAmount());
		model.setTotalDebitAmount(journal.getTotalDebitAmount());
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
		List<JournalLineItemRequestModel> requestModels = new ArrayList<>();
		if (journal.getJournalLineItems() != null && !journal.getJournalLineItems().isEmpty()) {
			for (JournalLineItem lineItem : journal.getJournalLineItems()) {
				JournalLineItemRequestModel requestModel = getLineItemModel(lineItem);
				requestModels.add(requestModel);
			}
			model.setJournalLineItems(requestModels);
		}
		return model;
	}

	public JournalLineItemRequestModel getLineItemModel(JournalLineItem lineItem) {
		JournalLineItemRequestModel requestModel = new JournalLineItemRequestModel();
		requestModel.setId(lineItem.getId());
		if (lineItem.getContact() != null) {
			requestModel.setContactId(lineItem.getContact().getContactId());
		}
		if (lineItem.getTransactionCategory() != null) {
			requestModel.setTransactionCategoryId(lineItem.getTransactionCategory().getTransactionCategoryId());
		}
		if (lineItem.getVatCategory() != null) {
			requestModel.setVatCategoryId(lineItem.getVatCategory().getId());
		}
		requestModel.setDescription(lineItem.getDescription());
		requestModel.setCreditAmount(lineItem.getCreditAmount());
		requestModel.setDebitAmount(lineItem.getDebitAmount());
		return requestModel;
	}

	public Collection<JournalLineItem> setReferenceId(Collection<JournalLineItem> journalLineItemList, Integer id) {

		if (journalLineItemList != null && journalLineItemList.size() > 0) {

			for (JournalLineItem journalLineItem : journalLineItemList) {
				journalLineItem.setReferenceId(id);
			}
			return journalLineItemList;
		}
		return null;
	}
}
