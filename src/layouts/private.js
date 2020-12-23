import React from 'react';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, name, node, ...rest }) => {
	let found = node.some((ele) => ele.moduleName === name);
	return (
		<Route
			{...rest}
			render={(props) =>
				node && found ? (
					<Component {...props} />
				) : (
					<div>You Are Not Allowed to view this page</div>
				)
			}
		/>
	);
};

export default PrivateRoute;
