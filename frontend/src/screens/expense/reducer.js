import { EXPENSE } from 'constants/types'

const initState = {
  expense_list: [],
  expense_detail: {},
  currency_list: [],
  supplier_list: [],
  project_list: [],
}

const ExpenseReducer = (state = initState, action) => {
  const { type, payload } = action
  switch (type) {
    case EXPENSE.EXPENSE_LIST:
      return {
        ...state,
        expense_list: Object.assign([], payload)
      }

    case EXPENSE.EXPENSE_DETAIL:
      return {
        ...state,
        expense_detail: Object.assign({}, payload)
      }

    case EXPENSE.CURRENCY_LIST:

      const currency_list = payload.data.map(currency => {
        return { label: currency.currencyName, value: currency.currencyCode }
      })

      return {
        ...state,
        currency_list: Object.assign([], currency_list)
      }

    case EXPENSE.PROJECT_LIST:
      const project_list = payload.data.map(project => {
        return { label: project.projectName, value: project.projectId }
      })

      return {
        ...state,
        project_list: Object.assign([], project_list)
      }

    case EXPENSE.SUPPLIER_LIST:
      const supplier_list = payload.data.map(supplier => {
        return { label: supplier.firstName, value: supplier.contactId }
      })

      return {
        ...state,
        supplier_list: Object.assign([], supplier_list)
      }

    case EXPENSE.BANK_ACCOUNT_LIST:
      const bank_account_list = payload.data.map(bank_account => {
        return { label: bank_account.bankAccountId, value: bank_account.bankAccountName }
      })

      return {
        ...state,
        bank_account_list: Object.assign([], bank_account_list)
      }

    case EXPENSE.CUSTOMER_LIST:
      const customer_list = payload.data.map(customer => {
        return { label: customer.firstName, value: customer.contactId }
      })

      return {
        ...state,
        customer_list: Object.assign([], customer_list)
      }

    case EXPENSE.PAYMENT_LIST:
      const payment_list = payload.data.map(payment => {
        return { label: payment.value, value: payment.paymentID }
      })

      return {
        ...state,
        payment_list: Object.assign([], payment_list)
      }


    default:
      return state
  }
}

export default ExpenseReducer