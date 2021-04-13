import { authFileUploadApi, authApi } from 'utils';
import { EXPENSE } from 'constants/types';

export const createExpense = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/expense/save',
			data: obj,
		};
		return authFileUploadApi(data)
			.then((res) => {
				return res;
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const checkAuthStatus = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/user/current',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					return res;
				} else {
					throw new Error('Auth Failed');
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getPaytoList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/reconsile/getChildrenTransactionCategoryList?id=91',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: EXPENSE.PAY_TO_LIST,
						payload: res.data,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};