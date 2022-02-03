import { REQUEST_FOR_QUOTATION } from 'constants/types';
import { authApi } from 'utils';
import moment from 'moment';

export const getRFQList = (postObj) => {
	let supplierId = postObj.supplierId ? postObj.supplierId.value : '';
	let rfqReceiveDate = postObj.invoiceDate ? postObj.invoiceDate : '';
	let rfqExpiryDate = postObj.rfqExpiryDate ? postObj.rfqExpiryDate : '';
	let rfqNumber = postObj.rfqNumber ? postObj.rfqNumber : '';
	let type = postObj.type ? postObj.type : '';
	let status = postObj.status ? postObj.status.value : '';
	let pageNo = postObj.pageNo ? postObj.pageNo : '';
	let pageSize = postObj.pageSize ? postObj.pageSize : '';
	let order = postObj.order ? postObj.order : '';
	let sortingCol = postObj.sortingCol ? postObj.sortingCol : '';
	let paginationDisable = postObj.paginationDisable
		? postObj.paginationDisable
		: false;

	return (dispatch) => {
		let param = `/rest/poquatation/getListForRfq?supplierId=${supplierId}&rfqNumber=${rfqNumber}&status=${status}&type=3&pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}&paginationDisable=${paginationDisable}`;
		if (rfqReceiveDate) {
			let date = moment(rfqReceiveDate).format('DD-MM-YYYY');
			param = param + `&rfqReceiveDate=${date}`;
		}
		if (rfqExpiryDate) {
			let date = moment(rfqExpiryDate).format('DD-MM-YYYY');
			param = param + `&rfqExpiryDate=${date}`;
		}
		let data = {
			method: 'get',
			url: param,
			// data: postObj
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					if (!postObj.paginationDisable) {
						dispatch({
							type: REQUEST_FOR_QUOTATION.REQUEST_FOR_QUOTATION_LIST,
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
						type: REQUEST_FOR_QUOTATION.PROJECT_LIST,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getExciseList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/exciseTax',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.EXCISE_LIST,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getContactList = (nameCode) => {
	let contactType = nameCode ? nameCode : '';
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/contact/getContactsForDropdown?contactType=${contactType}`,
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.CONTACT_LIST,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getStatusList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getInvoiceStatusTypes',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.STATUS_LIST,
						payload: res,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};



export const getVatList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/vatCategory',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.VAT_LIST,
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

export const getDepositList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/datalist/receipt/tnxCat`,
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.DEPOSIT_LIST,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getPaymentMode = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/payMode',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.PAY_MODE,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getProductList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/datalist/product?priceType=PURCHASE`,
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.PRODUCT_LIST,
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

export const getSupplierList = (id) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/contact/getContactsForDropdown?contactType=${id}`,
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.SUPPLIER_LIST,
						payload: res,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};
export const createSupplier = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/contact/save',
			data: obj,
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

export const removeBulk = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'delete',
			url: '/rest/invoice/deletes',
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

export const getCountryList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getcountry',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: REQUEST_FOR_QUOTATION.COUNTRY_LIST,
						payload: res.data,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const postInvoice = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/invoice/posting',
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

export const unPostInvoice = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/invoice/undoPosting',
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

export const deleteInvoice = (id) => {
	return (dispatch) => {
		let data = {
			method: 'DELETE',
			url: `/rest/invoice/delete?id=${id}`,
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

export const getStateList = (countryCode) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getstate?countryCode=' + countryCode,
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					// dispatch({
					//   type: CONTACT.STATE_LIST,
					//   payload: res.data
					// })
					return res;
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const sendMail = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: `/rest/poquatation/sendrfq`,
			data:obj
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

export const createPO = (id) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: `/rest/poquatation/savepo?id=${id}`,
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


export const changeStatus = (id) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: `/rest/poquatation/changeStatus?id=${id}`,
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
export const getOverdueAmountDetails = (invoiceType) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/invoice/getOverDueAmountDetails?type=' + invoiceType,
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
export const getInvoicePrefix = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/customizeinvoiceprefixsuffix/getListForInvoicePrefixAndSuffix?invoiceType=3',
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