import React from "react";
import { Row, Table } from "reactstrap";
import { Currency } from "components";
import moment from "moment";
import LocalizedStrings from "react-localization";
import { data } from "../screens/Language/index";
import { Link } from "react-router-dom";

let strings = new LocalizedStrings(data);

if (localStorage.getItem("language") == null) {
  strings.setLanguage("en");
} else {
  strings.setLanguage(localStorage.getItem("language"));
}

const PayrollSummary = [
  {
    field: "payrollDate",
    headerName: "Payroll Date",
    headerClassName: "table-header-bg",
    flex: 1,
    hideable: false,
    renderCell: (params) => {
      return renderDate(params.row.payrollDate);
    },
  },
  {
    field: "payrollSubject",
    headerName: "Subject",
    headerClassName: "table-header-bg",
    flex: 1,
    hideable: false,
    renderCell: (params) => {
      return params.row.payrollSubject !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/payroll/payrollApproverScreen",
            state: {
              id: params.row.payrollId,
              gotoReports: "/admin/report/payroll-summary",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.payrollSubject}
        </Link>
      ) : (
        <span>{params.row.payrollSubject}</span>
      );
    },
  },
  {
    field: "payPeriod",
    headerName: "Pay Period",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      const payPeriod = params.row.payPeriod;
      const dateArr = payPeriod ? payPeriod.split("-") : [];
      const startDate = dateArr[0].replaceAll("/", "-");
      const endDate = dateArr[1].replaceAll("/", "-");
      return (
        <div>
          <Table className="">
            <Row className="m-0">
              <b>Start-Date:</b> {startDate}
            </Row>
            <Row className="m-0">
              <b>End-Date:</b> {endDate}
            </Row>
          </Table>
        </div>
      );
    },
  },
  {
    field: "employeeCount",
    headerName: "Employee Count",
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "payrollApproverName",
    headerName: "Approver",
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "approvedBy",
    headerName: "Approved BY",
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.totalAmount);
      // return params.row.totalAmount;
    },
  },
  {
    field: "comment",
    headerName: "Comments",
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "dueAmount",
    headerName: "Due Amount",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.dueAmount);
      // return params.row.totalAmount;
    },
  },
  {
    field: "generatedByName",
    headerName: "Generated By",
    headerClassName: "table-header-bg",
    flex: 1,
  },
];

const SalesByCustomer = [
  {
    field: "customerName",
    headerName: strings.CustomerName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
  },
  {
    field: "invoiceCount",
    headerName: strings.InvoiceCount,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceId",
    headerName: strings.InvoiceId,
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "salesExcludingvat",
    headerName: strings.SalesExcludingTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.salesExcludingvat);
    },
  },
  {
    field: "getSalesWithVat",
    headerName: strings.SalesWithTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.getSalesWithvat);
    },
  },
];
const CustomerAccountStatement = [
  {
    field: "contactName",
    headerName: strings.CustomerName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      if (params.row.id === 0) {
        return (
          <div className="position-absolute pl-2" style={{ left:'0px', fontWeight:'600' }}>
            {params.value}
          </div>
        );
      } else {
        return params.value;
      }
    },
  },
  {
    field: "invoiceDate",
    headerName: strings.Date,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    renderCell: (params) => {
      return renderDate(params.row.invoiceDate);
    },
  },
  {
    field: "type",
    headerName: strings.Type,
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNo,
    headerClassName: "table-header-bg",
    flex: 1,
  },
  {
    field: "totalAmount",
    headerName: strings.TotalAmount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.totalAmount ? renderAmount(params.row.totalAmount) : "";
    },
  },
  {
    field: "amountPaid",
    headerName: strings.AmountPaid,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.amountPaid ? renderAmount(params.row.amountPaid) : "";
    },
  },
  {
    field: "balanceAmount",
    headerName: strings.SalesWithTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.balanceAmount
        ? renderAmount(params.row.balanceAmount)
        : "";
    },
  },
];

const ExpenseDetails = [
  {
    field: "expenseDate",
    headerName: strings.ExpenseDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return renderDate(params.row.expenseDate);
    },
  },
  {
    field: "transactionCategoryName",
    headerName: strings.ExpenseCategory,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "status",
    headerName: strings.Status,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "expenseNumber",
    headerName: strings.ExpenseNumber,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "center",
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.expenseNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/expense/expense/view",
            state: {
              expenseId: params.row.expenseId,
              gotoReports: "/admin/report/expense-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.expenseNumber}
        </Link>
      ) : (
        <span>{params.row.expenseNumber}</span>
      );
    },
  },
  {
    field: "payMode",
    headerName: strings.PaymentMode,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "vatName",
    headerName: strings.VATCategory,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "expenseVatAmount",
    headerName: strings.VatAmount,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return renderAmount(params.row.expenseVatAmount);
    },
  },
  {
    field: "amountWithoutTax",
    headerName: strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.amountWithoutTax);
    },
  },
  {
    field: "expenseAmount",
    headerName: strings.Amount + " " + strings.WithTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.expenseAmount);
    },
  },
];

const ExpenseByCategoryDetails = [
  {
    field: "transactionCategoryName",
    headerName: strings.TransactionCategory,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
    hideable: false,
  },
  {
    field: "expensesVatAmountSum",
    headerName: strings.VatAmount,
    headerClassName: "table-header-bg",
    flex: 1,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return renderAmount(params.row.expensesVatAmountSum);
    },
  },
  {
    field: "expensesAmountWithoutTaxSum",
    headerName: strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.expensesAmountWithoutTaxSum);
    },
  },
  {
    field: "expensesAmountSum",
    headerName: strings.Amount + " " + strings.WithTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.expensesAmountSum);
    },
  },
];

const ReceivableInvoiceSummary = [
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.invoiceNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/income/customer-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/receivable-invoice-summary",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      ) : (
        <span>{params.row.invoiceNumber}</span>
      );
    },
  },
  {
    field: "customerName",
    headerName: strings.CustomerName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceDate",
    headerName: strings.InvoiceDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceDueDate",
    headerName: strings.InvoiceDueDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "status",
    headerName: strings.Status,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceTotalAmount",
    headerName: strings.InvoiceAmount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.invoiceTotalAmount);
    },
  },
  {
    field: "balance",
    headerName: strings.Balance,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.balance);
    },
  },
];

const ReceivableInvoiceDetails = [
  {
    field: "invoiceDate",
    headerName: strings.InvoiceDate,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
    hideable: false,
  },
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    renderCell: (params) => {
      return (
        <Link
          to={{
            pathname: "/admin/income/customer-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/receivable-invoice-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      );
    },
  },
  {
    field: "productName",
    headerName: strings.ProductName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "description",
    headerName: strings.Description,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
  },
  {
    field: "quantity",
    headerName: strings.Quantity,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "unitPrice",
    headerName: strings.UnitPrice,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "vatAmount",
    headerName: strings.VatAmount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.vatAmount === null
        ? ""
        : renderAmount(params.row.vatAmount);
    },
  },
  {
    field: "totalAmount",
    headerName: strings.Total + " " + strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.totalAmount === null
        ? ""
        : renderAmount(params.row.totalAmount);
    },
  },
];

const PurchaseByVendor = [
  {
    field: "vendorName",
    headerName: strings.Vendor + " " + strings.Name,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
  },
  {
    field: "invoiceCount",
    headerName: strings.InvoiceCount,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "salesExcludingvat",
    headerName: strings.Purchase + " " + strings.ExcludingTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.salesExcludingvat);
    },
  },
  {
    field: "getSalesWithvat",
    headerName: strings.Purchase + " " + strings.WithTax,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.getSalesWithvat);
    },
  },
];

const TaxCreditNoteDetails = [
  {
    field: "creditNoteNumber",
    headerName: strings.CreditNoteNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.creditNoteNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/income/credit-notes/view",
            state: {
              id: params.row.creditNoteId,
              isCNWithoutProduct: params.row.isCNWithoutProduct,
              gotoReports: "/admin/report/credit-note-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.creditNoteNumber}
        </Link>
      ) : (
        <span>{params.row.creditNoteNumber}</span>
      );
    },
  },
  {
    field: "customerName",
    headerName: strings.CustomerName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.invoiceNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/income/customer-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/credit-note-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      ) : (
        <span>{params.row.invoiceNumber}</span>
      );
    },
  },
  {
    field: "creditNoteDate",
    headerName: strings.CreditNoteDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "status",
    headerName: strings.Status,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "creditNoteTotalAmount",
    headerName: strings.SalesReturn,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.creditNoteTotalAmount);
    },
  },
  {
    field: "balance",
    headerName: strings.RemainingBalance,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.balance);
    },
  },
];

const TaxDebitNoteDetails = [
  {
    field: "creditNoteNumber",
    headerName: strings.DebitNoteNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.creditNoteNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/expense/debit-notes/view",
            state: {
              id: params.row.creditNoteId,
              isCNWithoutProduct: params.row.isCNWithoutProduct,
              gotoReports: "/admin/report/debit-note-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.creditNoteNumber}
        </Link>
      ) : (
        <span>{params.row.creditNoteNumber}</span>
      );
    },
  },
  {
    field: "customerName",
    headerName: strings.SupplierName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.invoiceNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/expense/supplier-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/debit-note-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      ) : (
        <span>{params.row.invoiceNumber}</span>
      );
    },
  },
  {
    field: "creditNoteDate",
    headerName: strings.DebitNoteDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "status",
    headerName: strings.Status,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "creditNoteTotalAmount",
    headerName: strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.creditNoteTotalAmount);
    },
  },
  {
    field: "balance",
    headerName: strings.RemainingBalance,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.balance);
    },
  },
];

const PayableInvoiceSummary = [
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable: false,
    renderCell: (params) => {
      return params.row.invoiceNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/expense/supplier-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/payable-invoice-summary",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      ) : (
        <span>{params.row.invoiceNumber}</span>
      );
    },
  },
  {
    field: "supplierName",
    headerName: strings.SupplierName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceDate",
    headerName: strings.InvoiceDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "invoiceDueDate",
    headerName: strings.InvoiceDueDate,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "status",
    headerName: strings.Status,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "totalInvoiceAmount",
    headerName: strings.InvoiceAmount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.totalInvoiceAmount);
    },
  },
  {
    field: "balance",
    headerName: strings.DueBalance,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return renderAmount(params.row.balance);
    },
  },
];

const PayableInvoiceDetails = [
  {
    field: "invoiceDate",
    headerName: strings.InvoiceDate,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
    hideable: false,
  },
  {
    field: "invoiceNumber",
    headerName: strings.InvoiceNumber,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    hideable:false,
    renderCell: (params) => {
      return params.row.invoiceNumber !== strings.Total ? (
        <Link
          to={{
            pathname: "/admin/expense/supplier-invoice/view",
            state: {
              id: params.row.invoiceId,
              gotoReports: "/admin/report/payable-invoice-details",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.invoiceNumber}
        </Link>
      ) : (
        <span>{params.row.invoiceNumber}</span>
      );
    },
  },
  {
    field: "productName",
    headerName: strings.ProductName,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "description",
    headerName: strings.Description,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
  },
  {
    field: "quantity",
    headerName: strings.Quantity,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "unitPrice",
    headerName: strings.UnitPrice,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "vatAmount",
    headerName: strings.VatAmount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.vatAmount === null || params.row.vatAmount === 0
        ? ""
        : renderAmount(params.row.vatAmount);
    },
  },
  {
    field: "totalAmount",
    headerName: strings.Total + " " + strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.totalAmount === null || params.row.totalAmount === 0
        ? ""
        : renderAmount(params.row.totalAmount);
    },
  },
];

const DetailedGeneralLedger = [
  {
    field: "date",
    headerName: strings.Date,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
    hideable: false,
  },
  {
    field: "postingReferenceTypeEnum",
    headerName: strings.TransactionType,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "transactionTypeName",
    headerName: strings.Account,
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
  },
  {
    field: "name",
    headerName: strings.TransactionDetails,
    headerAlign: "left",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "left",
  },
  {
    field: "transactionRefNo",
    headerName: strings.Transaction + "#",
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    renderCell: (params) => {
      if (params.row.deleteFlag) {
        return params.row.transactionRefNo;
      }
      const pathname = getInvoicePath(
        params.row.postingReferenceType,
        params.row.transactionType
      );
      return (
        <Link
          to={{
            pathname: pathname,
            state: {
              id: params.row.transactionId,
              gotoReports: "/admin/report/detailed-general-ledger",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.transactionRefNo}
        </Link>
      );
    },
  },
  {
    field: "referenceNo",
    headerName: strings.Reference + "#",
    headerAlign: "center",
    headerClassName: "table-header-bg",
    flex: 1,
    align: "center",
    renderCell: (params) => {
      if (params.row.deleteFlag) {
        return params.row.transactionRefNo;
      }
      const pathname = getReferencePath(
        params.row.postingReferenceType,
        params.row.transactionType
      );
      return (
        <Link
          to={{
            pathname: pathname,
            state: {
              id: params.row.referenceId,
              gotoReports: "/admin/report/detailed-general-ledger",
            },
          }}
          style={{ textAlign: "left", color: "#2046DB", cursor: "pointer" }}
        >
          {params.row.referenceNo}
        </Link>
      );
    },
  },
  {
    field: "debitAmount",
    headerName: strings.Debit,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.debitAmount ? renderAmount(params.row.debitAmount) : "";
    },
  },
  {
    field: "creditAmount",
    headerName: strings.Credit,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.creditAmount
        ? renderAmount(params.row.creditAmount)
        : "";
    },
  },
  {
    field: "amount",
    headerName: strings.Amount,
    headerAlign: "right",
    align: "right",
    headerClassName: "table-header-bg",
    flex: 1,
    renderCell: (params) => {
      return params.row.amount ? renderAmount(params.row.amount) : "";
    },
  },
];
export const List = {
  PayrollSummaryReport: PayrollSummary,
  "Sales By Customer": SalesByCustomer,
  "Customer Account Statement": CustomerAccountStatement,
  "Expense Details": ExpenseDetails,
  "Expense By Category Details": ExpenseByCategoryDetails,
  "Receivable Invoice Summary": ReceivableInvoiceSummary,
  "Receivable Invoice Details": ReceivableInvoiceDetails,
  "Detailed General Ledger": DetailedGeneralLedger,
  "Purchase By Vendor": PurchaseByVendor,
  "Tax Credit Note Details": TaxCreditNoteDetails,
  "Debit Note Detail Report": TaxDebitNoteDetails,
  "Payable Invoice Summary": PayableInvoiceSummary,
  "Payable Invoice Details": PayableInvoiceDetails,
};

function renderDate(date) {
  if (date) return moment(date).format("DD-MM-YYYY");
  else return "";
}
function renderAmount(amount) {
  return (
    <div>
      {/* <label className="font-weight-bold mr-2 ">{strings.Payroll + " " + strings.Amount}: </label> */}
      <label>
        <Currency value={amount} />
      </label>
    </div>
  );
}

function getInvoicePath(postingType, type) {
  if (postingType === "EXPENSE") {
    return "/admin/expense/expense/view";
  } else if (postingType === "INVOICE") {
    if (type === 1) {
      return "/admin/expense/supplier-invoice/view";
    } else {
      return "/admin/income/customer-invoice/view";
    }
  } else if (postingType === "DEBIT_NOTE") {
    return "/admin/expense/debit-notes/view";
  } else if (postingType === "CREDIT_NOTE") {
    return "/admin/income/credit-notes/view";
  } else if (postingType === "RECEIPT" || postingType === "BANK_RECEIPT") {
    return "/admin/income/customer-invoice/view";
  } else if (postingType === "PAYMENT" || postingType === "BANK_PAYMENT") {
    return "/admin/expense/supplier-invoice/view";
  } else if (postingType === "MANUAL") {
    return "/admin/accountant/journal/detail";
  } else {
    return "#";
  }
}

function getReferencePath(postingType, type) {
  if (postingType === "EXPENSE") {
    return "/admin/expense/expense/view";
  } else if (postingType === "INVOICE") {
    if (type === 1) {
      return "/admin/expense/purchase-order/view";
    } else {
      return "/admin/income/quotation/view";
    }
  } else if (postingType === "DEBIT_NOTE") {
    return "/admin/expense/debit-notes/view";
  } else if (postingType === "CREDIT_NOTE") {
    return "/admin/income/credit-notes/view";
  } else if (postingType === "RECEIPT" || postingType === "BANK_RECEIPT") {
    return "/admin/income/receipt/view";
  } else if (postingType === "PAYMENT" || postingType === "BANK_PAYMENT") {
    return "/admin/expense/purchase-receipt/view";
  } else if (postingType === "MANUAL") {
    return "/admin/accountant/journal/detail";
  } else {
    return "#";
  }
}
