

import { IMPORT } from 'constants/types';
import { authApi, authFileUploadApi } from 'utils';


export const uploadFolder = (obj) => {
	return (dispatch) => {
		let data = {
			method: 'post',
			url: '/rest/migration/uploadFolder',
			data: obj,
			headers: {
				'Content-Type': 'multipart/form-data',
			  }
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
	export const migrationProduct = () => {
		return (dispatch) => {
			let data = {
				method: 'get',
				url: '/rest/migration/list',
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

	

	export const migrate = (obj) => {
		return (dispatch) => {
			let data = {
				method: 'post',
				url: '/rest/migration/migrate',
				data: obj,
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


	export const getVersionListByPrioductName = (productName) => {
		return (dispatch) => {
		  let data = {
			method: 'GET',
			url: `/rest/migration/getVersionListByPrioductName?productName=${productName}`
		  }
		  return authApi(data)
		  .then((res) => {
			  if (res.status === 200) {
				  return res;
			  }
		  })
		  .catch((err) => {
			  throw err;
		  });
		}
	  }

	  export const getFileData = (obj) => {
		return (dispatch) => {
		  let data = {
			method: 'GET',
			url: `/rest/migration/getFileData?fileName=${obj.fileName}`
		  }
		  return authApi(data)
		  .then((res) => {
			
		  if (res.status === 200) {
				dispatch({
					type: IMPORT.FILE_DATA_LIST,
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
		}
	  }

	  export const listOfTransactionCategory = () => {
		return (dispatch) => {
		  let data = {
			method: 'GET',
			url: `/rest/migration/listOfTransactionCategory`
		  }
		  return authApi(data)
		  .then((res) => {
			  if (res.status === 200) {
				  return res;
			  }
		  })
		  .catch((err) => {
			  throw err;
		  });
		}
	  }
	
	  export const getListOfAllFiles = () => {
		return (dispatch) => {
		  let data = {
			method: 'GET',
			url: `/rest/migration/getListOfAllFiles`
		  }
		  return authApi(data)
		  .then((res) => {
			  if (res.status === 200) {
				  return res;
			  }
		  })
		  .catch((err) => {
			  throw err;
		  });
		}
	  }

	export const saveAccountStartDate = (obj) => {
		return (dispatch) => {
			let data = {
				method: 'post',
				url: '/rest/migration/saveAccountStartDate',
				data: obj,
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
	 