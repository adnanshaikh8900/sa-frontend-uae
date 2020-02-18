package com.simplevat.constant;

public enum WebLayerErrorCodeEnum {

	TEST1("Some Test 1",false), TEST2("Some Test2", true);
	WebLayerErrorCodeEnum(String errorDescription_,boolean businessException_) {
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
