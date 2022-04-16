import { EMPLOYEEPAYROLL } from 'constants/types';
import {
  authApi, authFileUploadApi
} from 'utils'


export const getVatPaymentHistoryList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/vatReport/getVatPaymentHistoryList',
	
		};
		return authFileUploadApi(data)
			.then((res) => {
				return res			
			})
			.catch((err) => {
				throw err;
			});
	};
};
