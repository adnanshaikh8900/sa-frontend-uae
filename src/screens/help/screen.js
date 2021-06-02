import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import configData from '../../constants/config';

// import { bindActionCreators } from 'redux'
import { Card, CardBody, Col, Row ,CardGroup} from 'reactstrap';
import {data}  from '../../screens//Language/index'
import LocalizedStrings from 'react-localization';
import './style.scss';

let strings = new LocalizedStrings(data);
const mapStateToProps = (state) => {
	return {
		version: state.common.version,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

class Help extends React.Component {
	constructor(props) {
		super(props);
		this.state = {	language: window['localStorage'].getItem('language'),};
	}

	render() {
		strings.setLanguage(this.state.language);
		const faqIcon = require('assets/images/settings/faq.png');
		const userIcon = require('assets/images/settings/user.png');
		const versionimage = require('assets/images/settings/version.png');
		const {  version } = this.props;
		return (
			<div className="help-screen">
				<div className="animated fadeIn">
					<Row>
						<Col lg="8" className="mx-auto my-auto">
							<Row>
								<CardGroup style={{
							width: "100%",

						}}>
									<Card style={{
							width: "50%",

						}}>
										<CardBody>
										<div>
											<div className="text-center">
												<img src={faqIcon} width="40%" alt=""></img>
											</div>
											<div><h4>{strings.Question}</h4></div>
											<p>
											{strings.Find}
											</p>
											{/* <Link to="https://www.simplevat.com/faqs/">Go to FAQ</Link> */}
										<b>	<a target="_blank" href="https://www.simplevat.com/faqs/" style={{ color: '#2266d8' }}>{strings.GotoFAQ}</a></b>
										</div>
										</CardBody>
									</Card>
							
									<Card className="ml-2">
										<CardBody>
										<div>
											<div className="text-center">
												<img src={userIcon} width="40%" alt=""></img>
											</div>
											<div><h4>{strings.CustomerSupport}</h4></div>
											<p>
											{strings.Find}						</p>
											<div className="d-flex justify-content-center">
												{/* <button className="btn-pill btn btn-primary btn-lg">
													<i className="icon-phone icons font-2xl d-block"></i>
												</button>
												<button className="btn-pill btn btn-primary btn-lg">
													<i className="cui-comment-square icons font-2xl d-block"></i>
												</button> */}
												<button className="btn-pill btn btn-primary btn-lg"
												>
											
													<i
														className="cui-envelope-closed icons font-2xl d-block"
														style={{ marginTop: -5 }}
													></i>
												
												</button>
												<p>support@simpleaccounts.io</p>
											</div>
											</div>
										</CardBody>
									</Card>
								</CardGroup>
								</Row>
								<Row>
								<CardGroup className="mt-2" style={{
							width: "100%",

						}}>
									<Card style={{
							width: "50%",

						}}>
										<CardBody>
										<div>
											<div className="text-center">
												<img src={versionimage} width="40%" alt=""></img>
											</div>
											<h4>{strings.Version}</h4>
											<p>
											{strings.FrontEndVerison}:  <label className="mb-0 text-primary">{configData.FRONTEND_RELEASE}</label><br></br>
											{strings.BackEndVersion}: {
           																   version !== '' ?
            														    <label className="mb-0 text-primary">{version}</label>
           																	   :
            																    ''
          																				  }
											</p>
											{/* <Link to="https://www.simplevat.com/faqs/">Go to FAQ</Link> */}
							{/* <b>	<a target="_blank" href="https://www.simplevat.com/faqs/" style={{ color: '#2266d8' }}>Go to FAQ</a></b> */}
							</div>
										</CardBody>
									</Card>
								
									<Card className="ml-2">
										<CardBody>
										<div>
											<div className="text-center" >
												<img src={faqIcon} width="40%" alt=""></img>
											</div>
											{/* <h4>Simple Accounts Version Numbers</h4>
											<p>
												FrontEnd Verison:  <label className="mb-0 text-primary">{configData.FRONTEND_RELEASE}</label><br></br>
												BackEnd Version: {
           																   version !== '' ?
            														    <label className="mb-0 text-primary">{version}</label>
           																	   :
            																    ''
          																				  }
											</p> */}
											{/* <Link to="https://www.simplevat.com/faqs/">Go to FAQ</Link> */}
							{/* <b>	<a target="_blank" href="https://www.simplevat.com/faqs/" style={{ color: '#2266d8' }}>Go to FAQ</a></b> */}
										
											</div>
										</CardBody>
									</Card>
								</CardGroup>
							</Row>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Help);
