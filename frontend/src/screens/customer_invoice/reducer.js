import { CUSTOMER_INVOICE } from 'constants/types';

const initState = {
  customer_invoice_list: [],
  project_list: [],
  customer_list: [],
  currency_list: [],
  vat_list: [],
  product_list: [],
  // vendor_list: [],
  country_list: [],
  status_list: [],
};

const CustomerInvoiceReducer = (state = initState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CUSTOMER_INVOICE.CUSTOMER_INVOICE_LIST:
      return {
        ...state,
        customer_invoice_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.PROJECT_LIST:
      return {
        ...state,
        project_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.CUSTOMER_LIST:
      return {
        ...state,
        customer_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.STATUS_LIST:
      return {
        ...state,
        status_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.VAT_LIST:
      return {
        ...state,
        vat_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.PRODUCT_LIST:
      return {
        ...state,
        product_list: Object.assign([], payload.data),
      };

    case CUSTOMER_INVOICE.COUNTRY_LIST:
      return {
        ...state,
        country_list: Object.assign([], payload),
      };

    default:
      return state;
  }
};

export default CustomerInvoiceReducer;
