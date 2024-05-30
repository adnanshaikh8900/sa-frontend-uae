import React from 'react';
import { Modal } from 'reactstrap';
import 'react-phone-input-2/lib/style.css'
import CreateContact from '../../contact/screens/create/screen';

class CustomerModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {		};
	}
	render() {
		const {
			openCustomerModal,
			closeCustomerModal,
			contactType,
		} = this.props;
		return (
			<div className="contact-modal-screen">
				<Modal
					isOpen={openCustomerModal}
					className="modal-success contact-modal"
				>
					<CreateContact
						getCurrentContactData={(contactData) => {
							this.props.getCurrentUser(contactData);
						}}
						closeModal={(e) => {
							closeCustomerModal(e);
						}}
						contactType={contactType}
						isParentComponentPresent={true}
					/>
				</Modal>
			</div>
		);
	}
}

export default CustomerModal;
