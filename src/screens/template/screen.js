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
import simple2 from 'assets/images/invoice-template/simple2.png';
import horizon from 'assets/images/invoice-template/horizon.jpg';
import ejs from 'assets/images/invoice-template/ejs.jpg';
import union from 'assets/images/invoice-template/union.jpg';
import lola from 'assets/images/invoice-template/lola.jpg';
import tranquility from 'assets/images/invoice-template/tranquility.jpg';
import modernist from 'assets/images/invoice-template/modernist.jpg';
import * as TemplateActions from './actions';
// import { Templates } from './sections';
import { bindActionCreators } from 'redux';

// import 'react-select/dist/react-select.css'
import './style.scss';
import { data } from 'screens/Language';
import { RFC_2822 } from 'moment';

const mapStateToProps = (state) => {
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {
		templateActions: bindActionCreators(TemplateActions, dispatch),
	};
};

class Template extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enable1:false,
			enable2:false,
			selectedData:[]
			// activeTab: new Array(2).fill('1'),
		};
	}

	componentDidMount=()=>{
		
		this.props.templateActions
		.getTemplateList()
		.then((res) => {
			if (res.status === 200) {
				// this.props.userActions.getCompanyTypeList()
				for(let i=0;i<2;i++)
				{
					
					switch(res.data[i].templateId) {
						case 1:
							this.setState({enable1:res.data[i].enable});
						  break;
						case 2:
							this.setState({enable2:res.data[i].enable});
						  break;
						default:
						  // code block
					  }
				}
				this.setState({
					selectedData:res.data,

				});
			}
		})
		.catch((err) => {
		
	
		});

		
	}

	
	render() {
		const {selectedData}=this.state;
		console.log(selectedData,"suraj")
		return (
			<div className="financial-report-screen">
				<div className="animated fadeIn">
					<Card>
						<CardHeader>
							<Row>
								<Col lg={12}>
									<div className="h4 mb-0 d-flex align-items-center">
										<i className="nav-icon fas fa-palette" />
										<span className="ml-2 " >Mail Themes</span>
									</div>
								</Col>
							</Row>
						</CardHeader>
					
						<CardBody>
							<InvoiceTemplate templateId="1" enable={this.state.enable1}  templateTitle="Basic" templateImg={Basic}></InvoiceTemplate>
							<InvoiceTemplate templateId="2" enable={this.state.enable2} templateTitle="simple2" templateImg={simple2}></InvoiceTemplate>
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
