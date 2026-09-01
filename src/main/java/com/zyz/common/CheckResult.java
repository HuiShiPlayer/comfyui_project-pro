package com.zyz.common;


import io.jsonwebtoken.Claims;

public class CheckResult {
	private boolean Success;
	private Claims claims;
	private Integer errCode;
	
	public Integer getErrCode() {
		return errCode;
	}
	public void setErrCode(Integer errCode) {
		this.errCode = errCode;
	}
	public boolean isSuccess() {
		return Success;
	}
	public void setSuccess(boolean success) {
		Success = success;
	}
	public Claims getClaims() {
		return claims;
	}
	public void setClaims(Claims claims) {
		this.claims = claims;
	}
	@Override
	public String toString() {
		return "CheckResult [Success=" + Success + ", claims=" + claims + ", errCode=" + errCode + "]";
	}
	

}
