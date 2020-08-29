import { COMMON } from 'constants/types';

const initState = {
	is_loading: false,
	version: '',
	tostifyAlertFunc: null,
	tostifyAlert: {},
	universal_currency_list: [],
};

const CommonReducer = (state = initState, action) => {
	const { type, payload } = action;

	switch (type) {
		case COMMON.START_LOADING:
			return {
				...state,
				is_loading: true,
			};

		case COMMON.END_LOADING:
			return {
				...state,
				is_loading: false,
			};

		case COMMON.TOSTIFY_ALERT_FUNC:
			return {
				...state,
				tostifyAlertFunc: payload.data,
			};

		case COMMON.TOSTIFY_ALERT:
			if (state.tostifyAlertFunc) {
				state.tostifyAlertFunc(payload.status, payload.message);
			}
			return {
				...state,
				tostifyAlert: { status: payload.status, message: payload.message },
			};
		// break;

		case COMMON.VAT_VERSION:
			return {
				...state,
				version: payload.data,
			};

		case COMMON.UNIVERSAL_CURRENCY_LIST:
			return {
				...state,
				universal_currency_list: Object.assign([], payload.data),
			};

		default:
			return state;
	}
};

export default CommonReducer;
