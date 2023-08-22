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

export const getCreditNoteById = (_id, isCNWithoutProduct) => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/creditNote/getCreditNoteById?id=${_id}&isCNWithoutProduct=${isCNWithoutProduct}`
		}
		return authApi(data).then((res) => {
			return res
		}).catch((err) => {
			throw err
		})
	}
}
export const getInvoicesForCNById = (_id) => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/creditNote/getInvoiceByCreditNoteId?id=${_id}`
		}
		return authApi(data).then((res) => {
			return res
		}).catch((err) => {
			throw err
		})
	}
};
export const getCompanyDetails = () => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/company/getCompanyDetails`
		}

		return authApi(data).then((res) => {
			return res
		}).catch((err) => {
			throw err
		})
	}
}
export const getContactById = (id) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/contact/getContactById?contactId=${id}`,
		}

		return authApi(data).then((res) => {
			return res
		}).catch((err) => {
			throw err
		})
	}
}