package com.simplevat.service.exceptions;

public enum ServiceErrorCode {
	
	
	RecordAlreadyExists("Record Already Exists", true), RecordDoesntExists("Record does not Exists", true);

	
	ServiceErrorCode(String errorDescription_,boolean businessException_) {
		this.errorDescription = errorDescription_;
		this.businessException = businessException_;
	}

	public String getErrorDescription() {
		return errorDescription;
	}

	public void setErrorDescription(String errorDescription) {
		this.errorDescription = errorDescription;
	}

	public boolean isBusinessException() {
		return businessException;
	}

	public void setBusinessException(boolean businessException) {
		this.businessException = businessException;
	}

	private String errorDescription;
	private boolean businessException;
}
