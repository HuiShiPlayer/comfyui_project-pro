package com.zyz.common;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;


public class ServerResponse<T> implements Serializable {
	/**
	 * @author 开发人员姓名
	 * @data 2019年1月11日--上午12:23:32
	 * 
	 * 
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int status;
	private String msg;
	private T data;

	private ServerResponse(int status) {
		this.status = status;
	}

	private ServerResponse(int status, T data) {
		this.status = status;
		this.data = data;
	}

	private ServerResponse(int status, String msg, T data) {
		this.status = status;
		this.msg = msg;
		this.data = data;
	}

	private ServerResponse(int status, String msg) {
		this.status = status;
		this.msg = msg;
	}

	@JsonIgnore
	// 使之不在json序列化结果当中
	public boolean isSuccess() {
		return this.status == ResponseCode.SUCCESS.getCode();
	}

	public int getStatus() {
		return status;
	}

	public T getData() {
		return data;
	}

	public String getMsg() {
		return msg;
	}

	// 成功信息
	public static <T> ServerResponse<T> createBySuccess() {
		return new ServerResponse<T>(ResponseCode.SUCCESS.getCode());
	}

	public static <T> ServerResponse<T> createBySuccessMessage(String msg) {
		return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(), msg);
	}

	public static <T> ServerResponse<T> createBySuccess(T data) {
		return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(), data);
	}

	public static <T> ServerResponse<T> createBySuccess(String msg, T data) {
		return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(), msg, data);
	}
	// 失败信息
	public static <T> ServerResponse<T> createByError() {
		return new ServerResponse<T>(ResponseCode.ERROR.getCode(), ResponseCode.ERROR.getDesc());
	}

	public static <T> ServerResponse<T> createByErrorExpire() {
		return new ServerResponse<T>(ResponseCode.EXPIRE.getCode(), ResponseCode.EXPIRE.getDesc());
	}

	public static <T> ServerResponse<T> createByErrorMessage(String errorMessage) {
		return new ServerResponse<T>(ResponseCode.ERROR.getCode(), errorMessage);
	}



	public static <T> ServerResponse<T> createByErrorCodeMessage(int errorCode, String errorMessage) {
		return new ServerResponse<T>(errorCode, errorMessage);
	}

}
