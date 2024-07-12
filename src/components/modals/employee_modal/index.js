import React from 'react';
import { Modal } from 'reactstrap';
import 'react-phone-input-2/lib/style.css'
import CreateEmployee from 'screens/payrollemp/screens/create';

class EmployeeModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {		};
	}
	render() {
		const {
			openModal,
			closeModal,
			contactType,
		} = this.props;
        console.log('kdjslkdjlks')
		return (
			<div className="contact-modal-screen">
				<Modal
					isOpen={openModal}
					className="modal-success contact-modal"
				>
					<CreateEmployee
						getCurrentContactData={(contactData) => {
							this.props.getCurrentUser(contactData);
						}}
						closeModal={(e) => {
							closeModal(e);
						}}
						contactType={contactType}
						isParentComponentPresent={true}
					/>
				</Modal>
			</div>
		);
	}
}

export default EmployeeModal;
