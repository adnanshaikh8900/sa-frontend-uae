// Defines an arrays of objects
// Where each object represents an invoice status along with a corresponding list of actions. 

export const InvoiceStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Send', 'Mark As Sent', 'Create A Duplicate', 'Delete'] },
    { status: 'Due', list: ['Record Payment', 'Create A Duplicate', 'Send Again', 'Delete'] },
    { status: 'Partially Paid', list: ['Record Payment', 'Create A Duplicate', 'Send Again'] },
    { status: 'Paid', list: ['Create A Duplicate', 'Send Again', 'Create Tax Credit Note'] },
]

export const CreditNoteStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Send', 'Mark As Sent', 'Delete'] },
    { status: 'Open', list: ['Draft','Refund Payment', 'Apply To Invoice', 'Send Again', 'Delete'] },
    { status: 'Partially Credited', list: ['Refund Payment', 'Apply To Invoice', 'Send Again'] },
    { status: 'Closed', list: ['Send Again'] },
]

export const QuotationStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Send', 'Mark As Sent', 'Create A Duplicate'] },
    { status: 'Sent', list: ['Draft','Mark As Approved', 'Mark As Rejected', 'Create A Duplicate', 'Send Again', 'Close'] },
    { status: 'Approved', list: ['Create Invoice', 'Mark As Rejected', 'Create A Duplicate', 'Close'] },
    { status: 'Rejected', list: ['Mark As Approved','Close', 'Create A Duplicate'] },
    { status: 'Invoiced', list: ['Create A Duplicate', 'Send Again'] },
    { status: 'Closed', list: ['Create A Duplicate'] },
]

export const ExpenseStatusActionList = [
    { status: 'Draft', bankGenerated: false, list: ['Edit', 'Post', 'Create A Duplicate', 'Delete'] },
    { status: 'Posted', bankGenerated: false, list: ['Draft', 'Create A Duplicate','Delete'] },
    { status: 'Draft', bankGenerated: true, list: ['Edit', 'Post', 'Delete'] },
    { status: 'Posted', bankGenerated: true, list: [] },
]

export const SupplierInvoiceStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Post', 'Create A Duplicate', 'Delete'] },
    { status: 'Due', list: ['Draft','Record Payment', 'Create A Duplicate', 'Delete'] },
    { status: 'Partially Paid', list: ['Record Payment', 'Create A Duplicate'] },
    { status: 'Paid', list: ['Create A Duplicate', 'Create Debit Note'] },
]
export const DebitNoteStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Mark As Open', 'Delete'] },
    { status: 'Open', list: ['Draft', 'Refund Payment', 'Apply To Invoice','Delete'] },
    { status: 'Partially Debited', list: ['Refund Payment', 'Apply To Invoice'] },
    { status: 'Closed', list: [] },
]

export const PurchaseOrderStatusActionList = [
    { status: 'Draft', list: ['Edit', 'Send', 'Mark As Sent', 'Create A Duplicate', 'Delete'] },
    { status: 'Sent', list: ['Mark As Approved', 'Mark As Rejected', 'Create A Duplicate', 'Send Again', 'Delete'] },
    { status: 'Approved', list: ['Create Invoice', 'Mark As Rejected', 'Create A Duplicate', 'Send Again', 'Delete'] },
    { status: 'Rejected', list: ['Draft','Mark As Approved', 'Create A Duplicate', 'Send Again', 'Delete'] },
    { status: 'Invoiced', list: ['Create A Duplicate', 'Send Again'] },
]

export const IncomeReceiptStatusActionList = [
    { creditNoteIssued: false, customerSelected: true, list: ['Send', 'View'] },
    { creditNoteIssued: true, customerSelected: true, list: ['Send', 'View'] },
    { creditNoteIssued: false, customerSelected: false, list: ['View'] },
    { creditNoteIssued: true, customerSelected: false, list: ['View'] },
]

export const PurchaseReceiptStatusActionList = [
    { debitNoteIssued: false, list: ['View'] },
    { debitNoteIssued: true, list: ['View'] },
]
