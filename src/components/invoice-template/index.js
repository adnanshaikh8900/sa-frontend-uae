import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './style.scss'

class TemplateComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      templateTitle : props.templateTitle,
      isOpen: false
    }

  }

  openDialog = () => {
		this.setState({ isOpen: true });
	};
  closePreviewModal = () =>{
    this.setState({ isOpen: false });
  };

  render() {

    const {
      templateTitle,
      templateImg,
      styles
    } = this.props

    return (
      <div className="theme-wrapper">
        <p className="template-title">{templateTitle}</p>
        <img class="template-gallery" src={templateImg} onClick={this.openDialog}></img>
        <p>
        <a class="dialog show_preview Button" id="caption_2_link" href="" onClick={this.openDialog}>Preview</a>
        <a class="use_theme Button" >Use Theme</a>
        </p>
        
        <Modal isOpen={this.state.isOpen} centered className="modal-primary">
					<ModalHeader  tag="h4" className="preview-modal-title" toggle={this.toggleDanger} >
					<h5 className="mb-0">{templateTitle}</h5>
          <i className="fa fa-close close-btn"
								onClick={() => this.closePreviewModal()}
					></i>
					</ModalHeader>
					<ModalBody>
            <img class="preview-gallery" src={templateImg}></img>
            <p>
              <strong>
              Suitable for letterhead paper <br></br>
              Suitable for printed window envelope
              </strong></p>
					</ModalBody>
				</Modal>
      </div>

      
    )
  }
}

export default TemplateComponent


