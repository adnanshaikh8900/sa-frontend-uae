package com.simplevat.exceptions;

import com.simplevat.enums.WebLayerErrorCodeEnum;

public class WebLayerException extends BaseException {

	
	private String errorMsg;
	private WebLayerErrorCodeEnum errorCode;
	public static final String WEB = "WEB";
	
	public WebLayerException(String errorMsg_, WebLayerErrorCodeEnum errorCode_) {
		super(errorMsg_);
		this.errorMsg = errorMsg_;
		this.errorCode = errorCode_;
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public String getSource() {
		return WEB;
	}

	@Override
	public String getErrorCode() {
		return this.errorCode.name();
	}

	@Override
	public String getErrorDescription() {
		return this.errorMsg + ", " + this.errorCode.getErrorDescription();
	}

	@Override
	public boolean isBusinessException() {
		return this.errorCode.isBusinessException();
	}
}
