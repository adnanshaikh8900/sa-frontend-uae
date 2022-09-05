import React from 'react';
import { Modal } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-phone-input-2/lib/style.css'
import {data}  from '../../Language/index'
import LocalizedStrings from 'react-localization';
import  CreateContact from '../../contact/screens/create/screen';

let strings = new LocalizedStrings(data);
class CustomerModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			language: window['localStorage'].getItem('language'),
			showDetails : false,
			loading: false,
			initValue: {
				contactType: 2,
				billingEmail: '',
				city: '',
				contractPoNumber: '',
				countryId: '',
				currencyCode: '',
				email: '',
				firstName: '',
				addressLine1: '',
				addressLine2: '',
				addressLine3: '',
				// language(Language, optional),
				lastName: '',
				middleName: '',
				mobileNumber: '',
				organizationName: '',
			    poBoxNumber: '',
				postZipCode: '',
				stateId: '',
				telephone: '',
				vatRegistrationNumber: '',
				disabled: false,
				checkmobileNumberParam:false,
			},
			state_list: [],
		};
		this.formikRef = React.createRef();
		this.regEx = /^[0-9\d]+$/;
		this.regExBoth = /[a-zA-Z0-9]+$/;
		this.regExAlpha = /^[a-zA-Z ]+$/;
		this.regExAddress = /^[a-zA-Z0-9\s,'-]+$/;
	}

	getData = (data) => {
		let temp = {};
		for (let item in data) {
			if (typeof data[`${item}`] !== 'object') {
				temp[`${item}`] = data[`${item}`];
			} else {
				temp[`${item}`] = data[`${item}`].value;
			}
		}
		return temp;
	};

	// Create or Contact
	handleSubmit = (data, resetForm, setSubmitting) => {
		this.setState({ disabled: true });
		const postData = this.getData(data);
		this.props
			.createCustomer(postData)
			.then((res) => {
				let resConfig = JSON.parse(res.config.data);
				
				if (res.status === 200) {
					this.setState({ disabled: false });
					resetForm();
					this.props.closeCustomerModal(true);

					let tmpData = res.data;
					tmpData.currencyCode = resConfig.currencyCode;

					this.props.getCurrentUser(tmpData);
				}
			})
			.catch((err) => {
				this.setState({ disabled: false });
				this.displayMsg(err);
				this.formikRef.current.setSubmitting(false);
			});
	};

	displayMsg = (err) => {
		toast.error(`${err.data.message}`, {
			position: toast.POSITION.TOP_RIGHT,
		});
	};
	_showDetails = (bool) => {
		this.setState({
		  showDetails: bool
		});
	  }

	getStateList = (countryCode) => {
		if (countryCode) {
			this.props.getStateList(countryCode).then((res) => {
				if (res.status === 200) {
					this.setState({
						state_list: res.data,
					});
				}
			});
		} else {
			this.setState({
				state_list: [],
			});
		}
	};

	render() {
		strings.setLanguage(this.state.language);
		const {
			openCustomerModal,
			closeCustomerModal,
			currency_list,
			country_list,
		} = this.props;
		const { initValue, state_list, checkmobileNumberParam } = this.state;
		return (
			<div className="contact-modal-screen">
				<Modal
					isOpen={openCustomerModal}
					className="modal-success contact-modal"
				>
				<CreateContact
					getCurrentContactData={(contactData) =>{
						this.props.getCurrentUser(contactData);
					}}
					closeModal={(e) => {
						closeCustomerModal(e);
					}}
				contactType={{label: "Customer",value: 2}} 	
				isParentComponentPresent={true}
				/>
				</Modal>
			</div>
		);
	}
}

export default CustomerModal;
