import { authApi } from 'utils';

export const getInvoiceById = (_id) => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/invoice/getInvoiceById?id=${_id}`,
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

export const getInvoicesForCNById = (_id) => {
	return (dispatch) => {
	  let data = {
		method: 'GET',
		url: `rest/poquatation/getPoGrnById?id=${_id}`
	  }
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  };