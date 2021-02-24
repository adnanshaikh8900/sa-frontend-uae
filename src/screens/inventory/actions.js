import { INVENTORY } from 'constants/types';
import { authApi } from 'utils';

export const getProductInventoryList = (obj) => {
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
			url: `/rest/product/getInventoryProductList?pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}&paginationDisable=${paginationDisable}`,
		};
		return authApi(data)
			.then((res) => {
				if (!obj.paginationDisable) {
					dispatch({
						type: INVENTORY.SUMMARY_LIST,
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

