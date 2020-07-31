import { COMMON } from 'constants/types';
import { authApi } from 'utils';

export const startRequest = () => {
	return (dispatch) => {
		dispatch({
			type: COMMON.START_LOADING,
		});
	};
};

export const endRequest = () => {
	return (dispatch) => {
		dispatch({
			type: COMMON.END_LOADING,
		});
	};
};

export const setTostifyAlertFunc = (func) => {
	return (dispatch) => {
		dispatch({
			type: COMMON.TOSTIFY_ALERT_FUNC,
			payload: {
				data: func,
			},
		});
	};
};

export const tostifyAlert = (status, message) => {
	return (dispatch) => {
		dispatch({
			type: COMMON.TOSTIFY_ALERT,
			payload: {
				status,
				message,
			},
		});
	};
};

export const getSimpleVATVersion = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/config/getreleasenumber',
		};
		return authApi(data)
			.then((res) => {
				dispatch({
					type: COMMON.VAT_VERSION,
					payload: {
						data: res.data.simpleVatRelease,
					},
				});
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getCurrencyList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/bank/getcurrenncy',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: COMMON.CURRENCY_LIST,
						payload: {
							data: res.data,
						},
					});
					return res;
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};
