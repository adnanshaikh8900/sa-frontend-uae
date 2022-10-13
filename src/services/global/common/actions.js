import { COMMON, USERS_ROLES } from 'constants/types';
import { toast } from 'react-toastify';
import { api, authApi } from 'utils';

export const startRequest = () => {
	return (dispatch) => {
		dispatch({
			type: COMMON.START_LOADING,
		});
	};
};

export const endRequest = () => {
	return (dispatch) => {
		dispatch({
			type: COMMON.END_LOADING,
		});
	};
};

export const setTostifyAlertFunc = (func) => {
	return (dispatch) => {
		dispatch({
			type: COMMON.TOSTIFY_ALERT_FUNC,
			payload: {
				data: func,
			},
		});
	};
};

export const tostifyAlert = (status, message) => {
	return (dispatch) => {
		dispatch({
			type: COMMON.TOSTIFY_ALERT,
			payload: {
				status,
				message,
			},
		});
	};
};
export const getNoteSettingsInfo = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getNoteSettingsInfo',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					return res;
				}
				return res;
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const fillManDatoryDetails = (status, message) => {
	return (dispatch) => {
		toast.error(
			"Please Fill All Mandatory Details",
			{
				position: "top-center",
				draggable: true, 
				autoClose: 2000,
				progress: undefined,
				hideProgressBar: true,
			})
	};
};
export const getSimpleVATVersion = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/config/getreleasenumber',
		};
		return authApi(data)
			.then((res) => {
				dispatch({
					type: COMMON.VAT_VERSION,
					payload: {
						data: res.data.simpleVatRelease,
					},
				});
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getRoleList = (id) => {
	return (dispatch) => {
		let data = {
			method: 'GET',
			url: `/rest/roleModule/getModuleListByRoleCode?roleCode=${id}`,
		};
	
		return authApi(data)
			.then((res) => {
				
				dispatch({
					type: COMMON.USER_ROLE_LIST,
					payload: res.data,
				});
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
			url: '/rest/company/getState?countryCode=' + countryCode,
		};
		if (229) {
			return api(data)
				.then((res) => {
					if (res.status === 200) {
						dispatch({
							type: COMMON.STATE_LIST,
							payload: res.data,
						});
					}
				})
				.catch((err) => {
					throw err;
				});
		} else {
			dispatch({
				type: COMMON.STATE_LIST,
				payload: [],
			});
		}
	};
};

export const getCountryList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/company/getCountry',
		};
		return api(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: COMMON.COUNTRY_LIST,
						payload: res.data,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};
export const getCompanyTypeListRegister = () => {

	return (dispatch) => {
	  let data = {
		method: 'get',
		url: `/rest/company/getCompanyType`
	  }
	  return api(data)
	  .then((res) => {
		  if (res.status === 200) {
			  dispatch({
				  type: COMMON.COMPANY_TYPE,
				  payload: res.data,
			  });
		  }
		  console.log(res)
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
			url: '/rest/currency/getCompanyCurrencies',
		};
		return authApi(data)
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

export const getCompany = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: 'rest/company/getById?id=10000',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: COMMON.COMPANY_PROFILE,
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