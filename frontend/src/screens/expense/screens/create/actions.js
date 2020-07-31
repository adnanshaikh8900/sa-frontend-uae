import { authFileUploadApi } from 'utils';

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
