import React from 'react';
import { Route } from 'react-router-dom';
const permission = require('assets/images/settings/permission-removebg.png');
const PrivateRoute = ({ component: Component, name, node, ...rest }) => {
	let found = node.some((ele) => ele.moduleName === name);
	return (
		<Route
			{...rest}
			render={(props) =>
				node && found ? (
					<Component {...props} />
				) : (
					<center>
					<div ><i class="fas fa-exclamation-triangle fa-8x" >
					</i>
					<br></br><br></br>
						<b>You Are Not Allowed to view this page</b>
					</div>
					</center>
				)
			}
		/>
	);
};

export default PrivateRoute;
