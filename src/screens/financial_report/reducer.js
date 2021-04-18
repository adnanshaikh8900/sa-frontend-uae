import { REPORTS } from 'constants/types';

const initState = {
  sales_by_customer: [],
  sales_by_item: [],
  purchase_by_vendor: [],
  purchase_by_item: [],
  company_profile: [],

}

const ReportsReducer = (state = initState, action) => {
  const { type, payload } = action;

	switch (type) {
    case REPORTS.COMPANY_PROFILE:
			return {
				...state,
				company_profile: Object.assign([], payload.data),
			};
		case REPORTS.SALES_BY_CUSTOMER:
			return {
				...state,
				sales_by_customer: Object.assign([], payload.data),
			};
      case REPORTS.SALES_BY_ITEM:
			return {
				...state,
				sales_by_item: Object.assign([], payload.data),
			};
     
      case REPORTS.PURCHASE_BY_VENDOR:
        return {
          ...state,
          purchase_by_vendor: Object.assign([], payload.data),
        };
        case REPORTS.PURCHASE_BY_ITEM:
          return {
            ...state,
            purchase_by_item: Object.assign([], payload.data),
          };
    default:
      return state
  }
}

export default ReportsReducer