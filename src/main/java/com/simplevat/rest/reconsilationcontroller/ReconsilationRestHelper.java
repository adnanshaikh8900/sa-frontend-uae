package com.simplevat.rest.reconsilationcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.simplevat.constant.ReconsileCategoriesEnumConstant;
import com.simplevat.entity.Expense;
import com.simplevat.entity.Invoice;
import com.simplevat.service.ExpenseService;
import com.simplevat.service.InvoiceService;

@Component
public class ReconsilationRestHelper {

	@Autowired
	private ExpenseService expenseService;

	@Autowired
	private InvoiceService invoiceService;

	public List<ReconsilationListModel> getList(ReconsileCategoriesEnumConstant constant) {
		Map<String, Object> attribute = new HashMap<String, Object>();

		attribute.put("deleteFlag", Boolean.FALSE);

		List<ReconsilationListModel> modelList = new ArrayList<ReconsilationListModel>();
		switch (constant) {
		case EXPENSE:
			List<Expense> expenseList = expenseService.findByAttributes(attribute);
			for (Expense expense : expenseList) {
				modelList.add(new ReconsilationListModel(expense.getExpenseId(), expense.getExpenseDate().toString(),
						expense.getPayee(), expense.getExpenseAmount(),
						expense.getCurrency() != null ? expense.getCurrency().getCurrencySymbol() : ""));
			}
			break;

		case SUPPLIER_INVOICE:

			attribute.put("type", 1);
			List<Invoice> invoices = invoiceService.findByAttributes(attribute);
			for (Invoice invoice : invoices) {
				modelList.add(new ReconsilationListModel(invoice.getId(), invoice.getInvoiceDate().toString(),
						invoice.getReferenceNumber(), invoice.getTotalAmount(), invoice.getInvoiceDueDate().toString(),
						invoice.getCurrency() != null ? invoice.getCurrency().getCurrencySymbol() : ""));
			}
			break;

		default:
			break;
		}
		return modelList;
	}
}
