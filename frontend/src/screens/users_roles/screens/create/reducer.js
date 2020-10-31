import { USERS_ROLES } from 'constants/types';

const initState = {
	role_list: [],
};

const RoleReducer = (state = initState, action) => {
	const { type, payload } = action;
	switch (type) {
		case USERS_ROLES.ROLE_LIST:
			return {
				...state,
				role_list: Object.assign([], payload),
			};

		default:
			return state;
	}
};

export default RoleReducer;
