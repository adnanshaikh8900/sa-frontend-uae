package com.simplevat.rest.journalcontroller;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.simplevat.entity.Journal;
import com.simplevat.entity.JournalLineItem;
import com.simplevat.rest.invoicecontroller.InvoiceRestHelper;
import com.simplevat.service.ContactService;
import com.simplevat.service.CurrencyService;
import com.simplevat.service.TransactionCategoryService;

@Component
public class JournalRestHelper {

	@Autowired
	private CurrencyService currencyService;

	@Autowired
	private ContactService contactService;

	@Autowired
	private TransactionCategoryService transactionCategoryService;

	public Journal getEntity(JournalRequestModel journalRequestModel, Integer userId) {

		if (journalRequestModel != null) {
			Journal journal = new Journal();

			journal.setId(journalRequestModel.getId());
			if (journalRequestModel.getCurrencyCode() != null) {
				journal.setCurrency(currencyService.getCurrency(journalRequestModel.getCurrencyCode()));
			}

			journal.setJournalReferenceCode(journalRequestModel.getJournlReferenceCode());

			if (journalRequestModel.getJournalDate() != null) {
				LocalDateTime journalDate = Instant.ofEpochMilli(journalRequestModel.getJournalDate().getTime())
						.atZone(ZoneId.systemDefault()).toLocalDateTime();
				journal.setJournalDate(journalDate);
			}

			journal.setJournalDescription(journalRequestModel.getJournalDescription());

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

			System.out.println("====string=======" + journalRequestModel.getJournalLineItem());
			List<JournalLineItemRequestModel> itemModels = new ArrayList<>();
			if (journalRequestModel.getJournalLineItem() != null
					&& !journalRequestModel.getJournalLineItem().isEmpty()) {
//		            System.out.println("====string=======" + invoiceModel.getLineItemsString());
				System.out.println("====In=======");
				ObjectMapper mapper = new ObjectMapper();
				try {
					itemModels = mapper.readValue(journalRequestModel.getJournalLineItem(),
							new TypeReference<List<JournalLineItemRequestModel>>() {
							});
					System.out.println("====In=Try======" + itemModels.toString());
				} catch (IOException ex) {
					System.out.println("====In=catch======" + ex.getMessage());
					Logger.getLogger(InvoiceRestHelper.class.getName()).log(Level.SEVERE, null, ex);
				}
				System.out.println("====In=if======" + itemModels.size());
				if (itemModels.size() > 0) {
					journal.setJournalLineItems(getLineItems(itemModels, journal, userId));
				}
			}
			return journal;
		}

		return null;
	}

	public List<JournalLineItem> getLineItems(List<JournalLineItemRequestModel> itemModels, Journal journal,
			Integer userId) {
		List<JournalLineItem> lineItems = new ArrayList<>();
		int i = 0;
		for (JournalLineItemRequestModel model : itemModels) {
			try {
				JournalLineItem lineItem = new JournalLineItem();
				lineItem.setCreatedBy(userId);
				lineItem.setCreatedDate(LocalDateTime.now());
				lineItem.setDeleteFlag(false);
				System.out.println("====lineitems==getDescription======" + model.getDescription());
				lineItem.setDescription(model.getDescription());
				if (model.getContactId() != null) {
					lineItem.setContact(contactService.findByPK(model.getContactId()));
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
//	                supplierInvoiceLineItemService.persist(lineItem);
				lineItems.add(lineItem);
				i++;
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		System.out.println("====lineitems==added======" + i);
		return lineItems;
	}

	public void printData() {

		JournalLineItemRequestModel model = new JournalLineItemRequestModel();
		model.setCreditAmount(new BigDecimal(1000));
		model.setDebitAmount(new BigDecimal(2000));
		model.setDescription("description");
		model.setTransactionCategoryId(1);
		model.setContactId(1);

		JournalLineItemRequestModel model2 = new JournalLineItemRequestModel();
		model2.setCreditAmount(new BigDecimal(1000));
		model2.setDebitAmount(new BigDecimal(2000));
		model2.setDescription("description");
		model2.setTransactionCategoryId(1);
		model2.setContactId(1);

		List<JournalLineItemRequestModel> items = new ArrayList<JournalLineItemRequestModel>();

		items.add(model);
		items.add(model2);

		System.out.println(items);
	}

	public static void main(String[] args) {
		JournalRestHelper m = new JournalRestHelper();
		m.printData();

	}

	public List<JournalListModel> getListModel(List<Journal> journals) {

		if (journals != null && journals.size() > 0) {

			List<JournalListModel> journalModelList = new ArrayList<JournalListModel>();

			for (Journal journal : journals) {
				journalModelList.add(getModel(journal));
			}
			return journalModelList;
		}
		return null;
	}

	public JournalListModel getModel(Journal journal) {

		if (journal != null) {
			JournalListModel model = new JournalListModel();
			// XXX: need to add attribute accordingly
			model.setJournalDescription(journal.getJournalDescription());
			return model;
		}
		return null;
	}
}
