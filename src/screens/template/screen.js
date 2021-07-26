import React from 'react';
import { connect } from 'react-redux';
import {
	Card,
	CardHeader,
	CardBody,
	Row,
	Col,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap';

import { InvoiceTemplate } from 'components'
import bauhaus from 'assets/images/invoice-template/bauhaus.jpg';
import Basic from 'assets/images/invoice-template/Basic.jpg';
import simple from 'assets/images/invoice-template/simple.jpg';
import horizon from 'assets/images/invoice-template/horizon.jpg';
import ejs from 'assets/images/invoice-template/ejs.jpg';
import union from 'assets/images/invoice-template/union.jpg';
import lola from 'assets/images/invoice-template/lola.jpg';
import tranquility from 'assets/images/invoice-template/tranquility.jpg';
import modernist from 'assets/images/invoice-template/modernist.jpg';
// import { Templates } from './sections';


// import 'react-select/dist/react-select.css'
import './style.scss';

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {};
};

class Template extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// activeTab: new Array(2).fill('1'),
		};
	}

	render() {
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-boxes" />
										<span className="ml-2 " >Mail Templates</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
						<CardBody>
							<InvoiceTemplate templateId="1" templateTitle="Basic" templateImg={Basic}></InvoiceTemplate>
							<InvoiceTemplate templateId="2" templateTitle="Simple" templateImg={simple}></InvoiceTemplate>
							{/* <InvoiceTemplate templateId="3" templateTitle="Horizon" templateImg={horizon}></InvoiceTemplate>
							<InvoiceTemplate templateId="4" templateTitle="Elliot Jay stocks" templateImg={ejs}></InvoiceTemplate>
							<InvoiceTemplate templateId="5" templateTitle="Union" templateImg={union}></InvoiceTemplate>
							<InvoiceTemplate templateId="6" templateTitle="Lola" templateImg={lola}></InvoiceTemplate>
							<InvoiceTemplate templateId="7" templateTitle="Tranquility" templateImg={tranquility}></InvoiceTemplate>
							<InvoiceTemplate templateId="7" templateTitle="Modernist" templateImg={modernist}></InvoiceTemplate> */}
							
						</CardBody>
					</Card>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Template);
