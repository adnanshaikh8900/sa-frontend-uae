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

      const currency_list = payload.map(currency => {
        return { label: currency.currencyName, value: currency.currencyCode }
      })

      return {
        ...state,
        currency_list: Object.assign([], currency_list)
      }

    case EXPENSE.PROJECT_LIST:
      const project_list = payload.map(project => {
        return { label: project.projectName, value: project.projectId }
      })

      return {
        ...state,
        project_list: Object.assign([], project_list)
      }

    case EXPENSE.SUPPLIER_LIST:
      const supplier_list = payload.map(supplier => {
        return { label: supplier.firstName, value: supplier.contactId }
      })

      return {
        ...state,
        supplier_list: Object.assign([], supplier_list)
      }

    case EXPENSE.BANK_ACCOUNT_LIST:
      const bank_account_list = payload.map(bank_account => {
        return { label: bank_account.bankAccountId, value: bank_account.bankAccountName }
      })

      return {
        ...state,
        bank_account_list: Object.assign([], bank_account_list)
      }

    case EXPENSE.PAYMENT_LIST:

      const payment_list = payload.map(payment => {
        return { label: payment.amount, value: payment.paymentID }
      })

      return {
        ...state,
        payment_list: Object.assign([], payment_list)
      }

      case EXPENSE.VAT_LIST:

        const vat_list = payload.map(vat => {
          return { label: vat.name, value: vat.id }
        })
  
        return {
          ...state,
          vat_list: Object.assign([], vat_list)
        }
  
      case EXPENSE.CHART_OF_ACCOUNT_LIST:
        const chart_of_account_list = payload.map(item => {
          return { label: item.transactionCategoryDescription, value: item.transactionCategoryId }
        })
  
        return {
          ...state,
          chart_of_account_list: Object.assign([], chart_of_account_list)
        }
  

    default:
      return state
  }
}

export default ExpenseReducer