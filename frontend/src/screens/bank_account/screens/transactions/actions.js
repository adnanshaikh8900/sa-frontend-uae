import { BANK_ACCOUNT } from 'constants/types';
import {
  // api,
  authApi,
} from 'utils';
import moment from 'moment';

export const getTransactionList = (obj) => {
  let id = obj.id ? obj.id : '';
  let chartOfAccountId = obj.chartOfAccountId ? obj.chartOfAccountId.value : '';
  let transactionDate = obj.transactionDate ? obj.transactionDate : '';
  let pageNo = obj.pageNo ? obj.pageNo : '';
  let pageSize = obj.pageSize ? obj.pageSize : '';
  let paginationDisable = obj.paginationDisable ? obj.paginationDisable : false;

  let param = `/rest/transaction/list?bankId=${id}&chartOfAccountId=${chartOfAccountId}&pageNo=${pageNo}&pageSize=${pageSize}&paginationDisable=${paginationDisable}`;
  if (transactionDate !== '') {
    let date = moment(transactionDate).format('DD-MM-YYYY');
    console.log(date);
    param = param + `&transactionDate=${date}`;
  }
  return (dispatch) => {
    let data = {
      method: 'get',
      url: param,
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          if (!obj.paginationDisable) {
            dispatch({
              type: BANK_ACCOUNT.BANK_TRANSACTION_LIST,
              payload: {
                data: res.data,
              },
            });
          }
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getTransactionCategoryList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/transactioncategory/getList',
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: BANK_ACCOUNT.TRANSACTION_CATEGORY_LIST,
            payload: res.data,
          });
        }
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getTransactionTypeList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/datalist/getTransactionTypes',
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: BANK_ACCOUNT.TRANSACTION_TYPE_LIST,
            payload: res.data,
          });
        }
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getProjectList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/project/getProjectsForDropdown',
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: BANK_ACCOUNT.PROJECT_LIST,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const deleteTransactionById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/transaction/delete?id=${id}`,
    };
    return authApi(data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getChartOfCategoryList = (type) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/datalist/reconsileCategories?debitCreditFlag=${type}`,
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getTransactionCategoryListForExplain = (id) => {
  console.log(id);
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `rest/reconsile/getTransactionCat?chartOfAccountCategoryId=${id}`,
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const getCategoryListForReconcile = (code) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/reconsile/getByReconcilationCatCode?reconcilationCatCode=${code}`,
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

export const reconcileTransaction = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/rest/reconsile/reconcile`,
      data: obj,
    };
    return authApi(data)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        throw err;
      });
  };
};

// data: [{
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF3920342',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF3929865',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Unexplained',
//   reference_number: 'KDF39206574',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF392394',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Unexplained',
//   reference_number: 'KDF3920923',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }]
