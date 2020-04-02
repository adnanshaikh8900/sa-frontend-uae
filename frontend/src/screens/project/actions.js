import { PROJECT } from 'constants/types'
import {
  authApi
} from 'utils'

export const getProjectList = (obj) => {
  let projectName = obj.projectName ? obj.projectName : '';
  let expenseBudget = obj.expenseBudget ? obj.expenseBudget : '';
  let revenueBudget = obj.revenueBudget ? obj.revenueBudget : '';
  let vatRegistrationNumber = obj.vatRegistrationNumber ? obj.vatRegistrationNumber : '';
  let pageNo = obj.pageNo ? obj.pageNo : '';
  let pageSize = obj.pageSize ? obj.pageSize : '';
  let paginationDisable = obj.paginationDisable ? obj.paginationDisable : ''

  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/project/getList?projectName=${projectName}&expenseBudget=${expenseBudget}&revenueBudget=${revenueBudget}&vatRegistrationNumber=${vatRegistrationNumber}&pageNo=${pageNo}&pageSize=${pageSize}&paginationDisable=${paginationDisable}`
    }

    return authApi(data).then(res => {
      dispatch({
        type: PROJECT.PROJECT_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}





// Create & Save Project



// Create Project Contact
export  const createProjectContact = (project) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/rest/contact/save`,
      data: project
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Project Currency
export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/bank/getcurrenncy'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PROJECT.CURRENCY_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Project Country
export const getCountryList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/datalist/getcountry'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PROJECT.COUNTRY_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Project title
export const getTitleList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/project/gettitle/?titleStr'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PROJECT.TITLE_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const removeBulk = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/project/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getContactList = () => {
    return (dispatch) => {
      let data = {
        method: 'GET',
        url: '/rest/contact/getContactsForDropdown'
      }
      return authApi(data).then(res => {
        dispatch({
          type: PROJECT.CONTACT_LIST,
          payload: res.data
        })
        return res
      }).catch(err => {
        throw err
      })
    }
  }