import { authApi, authFileUploadApi } from 'utils';
import { REPORTS } from 'constants/types'


export const getSettings = (obj) => {
    return (dispatch) => {
        let data = {
            method: 'get',
            url: '/rest/corporate/tax/get/setting',
        };
        return authApi(data)
            .then((res) => {
                if (res.status === 200) {
                    dispatch({
                        type: REPORTS.SETTING_LIST,
                        payload: {
                            data: res.data,
                        },
                    });
                }
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };
};
export const generateCTReport = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/corporate/tax/generatect',
			data: obj,
		};
		return authApi(data)
			.then((res) => {
				return res			
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getCTPaymentHistoryList = (postObj) => {
	let pageNo = postObj?.pageNo ? postObj.pageNo : '';
	let pageSize = postObj?.pageSize ? postObj.pageSize : '';
	let order = postObj?.order ? postObj.order : '';
	let sortingCol = postObj?.sortingCol ? postObj.sortingCol : '';
	return (dispatch) => {
		let data = {
			method: 'get',
			url: `/rest/vatReport/getVatPaymentHistoryList?pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}`,
	
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