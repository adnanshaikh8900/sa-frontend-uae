import { authApi } from 'utils';
import { REPORTS } from 'constants/types';

export const getProfitAndLossReport = (postData) => {
	const { startDate, endDate } = postData;
	let url = `/rest/financialReport/profitandloss?startDate=${startDate}&endDate=${endDate}`;

	return (dispatch) => {
		let data = {
			method: 'get',
			url,
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
export const getSalesByCustomer = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/salesbycustomer?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

export const getReceivableInvoiceSummary = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/ReceivableInvoiceSummary?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getExpenseByCategory = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/ExpenseByCategory?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getPayableInvoiceSummary = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/PayableInvoiceSummary?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

export const getSalesByProduct = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/salesbyproduct?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getpurchasebyVendor = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/purchasebyVendor?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getpurchasebyproduct = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/purchasebyproduct?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getCreditNoteDetails = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/creditNoteDetails?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const getInvoiceDetails = (postData) => {
	const { startDate, endDate} = postData
	let url = `/rest/simpleaccountReports/invoiceDetails?startDate=${startDate}&endDate=${endDate}`
	return (dispatch) => {
	  let data = {
		method: 'get',
		url
	  }
	  return authApi(data).then((res) => {
		if (res.status === 200) {
		  return res
		}
	  }).catch((err) => {
		throw err
	  })
	}
  }


export const getTrialBalanceReport = (postData) => {
	const { startDate, endDate } = postData;
	let url = `/rest/financialReport/trialBalanceReport?endDate=${endDate}`;

	return (dispatch) => {
		let data = {
			method: 'get',
			url,
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

export const getBalanceReport = (postData) => {
	const { startDate, endDate } = postData;
	let url = `/rest/financialReport/balanceSheet?endDate=${endDate}`;

	return (dispatch) => {
		let data = {
			method: 'get',
			url,
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
	export const getVatReturnsReport = (postData) => {
		const { startDate, endDate } = postData;
		let url = `/rest/financialReport/vatReturnReport?startDate=${startDate}&endDate=${endDate}`;
	
		return (dispatch) => {
			let data = {
				method: 'get',
				url,
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

	export const getCompany = () => {
		return (dispatch) => {
			let data = {
				method: 'get',
				url: 'rest/company/getById?id=1',
			};
			return authApi(data)
				.then((res) => {
					if (res.status === 200) {
						dispatch({
							type: REPORTS.COMPANY_PROFILE,
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

	

	export const getPayrollSummaryReport = (postData) => {
		const { startDate, endDate } = postData;
		let url = `/rest/simpleaccountReports/getPayrollSummary?startDate=${startDate}&endDate=${endDate}`;
	
		return (dispatch) => {
			let data = {
				method: 'get',
				url,
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

	export const getCustomerList = () => {
		return (dispatch) => {
			let data = {
				method: 'get',
				url: `/rest/contact/getContactsForDropdown?contactType=2`,
			};
			return authApi(data)
				.then((res) => {
					if (res.status === 200) {
						return res.data;
					}
					return res;
				})
				.catch((err) => {
					throw err;
				});
		};
	};
	
	export const getSOA = (postData) => {
		const { startDate, endDate,customerId } = postData;
		let url = `/rest/simpleaccountReports/statementOfAccount?startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`;
	
		return (dispatch) => {
			let data = {
				method: 'get',
				url,
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