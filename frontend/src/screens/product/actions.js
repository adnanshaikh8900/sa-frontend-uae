import { PRODUCT } from 'constants/types';
import { authApi } from 'utils';

export const getProductList = (obj) => {
	let name = obj.name ? obj.name : '';
	let productCode = obj.productCode ? obj.productCode : '';
	let vatPercentage = obj.vatPercentage ? obj.vatPercentage.value : '';
	let pageNo = obj.pageNo ? obj.pageNo : '';
	let pageSize = obj.pageSize ? obj.pageSize : '';
	let order = obj.order ? obj.order : '';
	let sortingCol = obj.sortingCol ? obj.sortingCol : '';
	let paginationDisable = obj.paginationDisable ? obj.paginationDisable : false;

	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/product/getList?name=${name}&productCode=${productCode}&vatPercentage=${vatPercentage}&pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}&paginationDisable=${paginationDisable}`,
		};
		return authApi(data)
			.then((res) => {
				if (!obj.paginationDisable) {
					dispatch({
						type: PRODUCT.PRODUCT_LIST,
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

// Get Product By ID

// Create & Save Product
export const createAndSaveProduct = (product) => {
	return (dispatch) => {
		let data = {
			method: 'POST',
			url: `/rest/product/save`,
			data: product,
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

// Create Warehouse
export const createWarehouse = (warehouse) => {
	let data = {
		method: 'POST',
		url: `/rest/productwarehouse/saveWareHouse`,
		data: warehouse,
	};

	return authApi(data)
		.then((res) => {
			return res;
		})
		.catch((err) => {
			throw err;
		});
};

// Get Product Warehouse
export const getProductWareHouseList = () => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: '/rest/productwarehouse/getWareHouse',
		};

		return authApi(data)
			.then((res) => {
				dispatch({
					type: PRODUCT.PRODUCT_WHARE_HOUSE,
					payload: res.data,
				});
				return res;
			})
			.catch((err) => {
				throw err;
			});
	};
};

// Get Product VatCategory
export const getProductVatCategoryList = () => {
	return (dispatch, getState) => {
		const state = getState();
		let data = {
			method: 'GET',
			url: '/rest/datalist/vatCategory',
		};
		if (Object.keys(state.product.vat_list).length === 0) {
			return authApi(data)
				.then((res) => {
					dispatch({
						type: PRODUCT.PRODUCT_VAT_CATEGORY,
						payload: res.data,
					});
					return res;
				})
				.catch((err) => {
					throw err;
				});
		}
	};
};

// Get Parent Product
export const getProductCategoryList = () => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: '/rest/productcategory/getList',
		};

		return authApi(data)
			.then((res) => {
				dispatch({
					type: PRODUCT.PRODUCT_CATEGORY,
					payload: res.data,
				});
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
			url: '/rest/product/deletes',
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

export const getTransactionCategoryListForExplain = (id) => {
	console.log(id);
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/reconsile/getTransactionCat?chartOfAccountCategoryId=${id}`,
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

export const checkValidation = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/validation/validate?name=${obj.name}&moduleType=${obj.moduleType}`,
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

export const getInvoicesCountProduct = (id) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/product/getInvoicesCountForProduct/?productId=${id}`,
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
