import { AUTH, COMMON } from 'constants/types';
import { api, authApi, cryptoService } from 'utils';

export const checkAuthStatus = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/user/current',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: AUTH.SIGNED_IN,
					});
					dispatch({
						type: AUTH.USER_PROFILE,
						payload: {
							data: res.data,
						},
					});
					cryptoService.encryptService('userId', res.data.userId);
					return res;
				} else {
					throw new Error('Auth Failed');
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const logIn = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/auth/token',
			data: obj,
		};
		return api(data)
			.then((res) => {
				dispatch({
					type: AUTH.SIGNED_IN,
				});
				window['localStorage'].setItem('accessToken', res.data.token);
				// window['sessionStorage'].setItem('userId', res.data.userId);

				window['localStorage'].setItem('language', 'en');
				return res;
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const register = (obj) => {
	console.log ('simpleaccountsregister obj', obj)
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/company/register',
			data: obj,
		};
		return api(data)
			.then((res) => {
				console.log(res);
				// dispatch({
				// 	type: AUTH.REGISTER,
				// });
				//window['localStorage'].setItem('accessToken', res.data.token);
				// window['sessionStorage'].setItem('userId', res.data.userId);

				//return res;
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const registerStrapiCompany = (apiToken, companyObj) => {
	//console.log ('in register Company', apiToken)
	// console.log ('in register Company', companyObj)
	return (dispatch) => {
		let data = {
			method: 'post',
			url: 'https://strapi-api-test-ae.app.simpleaccounts.io/api/companies',
			data: companyObj,
			headers: {
				Authorization: `Bearer ${apiToken}`
			}
		};
		return api(data)
			.then((res) => {
				// alert ("response from company")
				//console.log(res);
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const registerStrapiUser = (obj, companyobj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: 'https://strapi-api-test-ae.app.simpleaccounts.io/api/auth/local/register',
			data: obj,
		};
		return api(data)
			.then((res) => {
				// alert("before json object")
				//console.log('userdata=',res.data)
				var text = JSON.stringify(companyobj, function (key, value) {
					// alert(key);
					if (key == "id") {
						value =  res.data.id;
					  return value;
					}
				  });

				// console.log("updated company obj = ",companyobj)
				//alert("after json convert")
				registerStrapiCompany (res.data.jwt, companyobj);
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getCurrencyList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/company/getCurrency',
		};
		return api(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: COMMON.UNIVERSAL_CURRENCY_LIST,
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
export const getCurrencylist = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/currency/getcurrency',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: COMMON.CURRENCY_LIST,
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

export const logOut = () => {
	return (dispatch) => {
		window['localStorage'].clear();

		dispatch({
			type: AUTH.SIGNED_OUT,
		});
	};
};

export const getCompanyCount = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/company/getCompanyCount',
		};
		return api(data)
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

export const getTimeZoneList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/company/getTimeZoneList',
		};
		return api(data)
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
