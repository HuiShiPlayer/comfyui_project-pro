package com.zyz.common;

public class AjaxResult {
	private String success;
	private String error;
	private String msg;
	private String rePath;
	private String fileNewName;
//	private List<String> file_path=new ArrayList<String>();
	private String file_path;
	public String getSuccess() {
		return success;
	}
	public void setSuccess(String success) {
		this.success = success;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getRePath() {
		return rePath;
	}
	public void setRePath(String rePath) {
		this.rePath = rePath;
	}

	public String getFile_path() {
		return file_path;
	}

	public String getFileNewName() {
		return fileNewName;
	}

	public void setFileNewName(String fileNewName) {
		this.fileNewName = fileNewName;
	}

	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}
}

