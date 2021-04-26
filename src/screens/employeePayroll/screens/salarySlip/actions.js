import {
  authApi
} from 'utils'


export const getSalariesByEmployeeId = (_id) => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/Salary/getSalariesByEmployeeId?id=${_id}`,
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