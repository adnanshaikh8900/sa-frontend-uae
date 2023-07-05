import { authApi, authFileUploadApi } from 'utils';

export const getCTView = (obj) => {
	let { id } = obj
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/corporate/tax/viewct?id=${id}`,
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