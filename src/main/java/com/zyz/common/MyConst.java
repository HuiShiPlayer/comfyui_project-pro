package com.zyz.common;

public class MyConst {
	public static final String pageSize = "10";
	public static final String USER_SESSION = "system_user";
	public static final Long ttlMillis_7days = new Long(1000 * 60 * 60 * 24 * 7);// 7天
	public static final Long ttlMillis_halfAYear = new Long(1000 * 60 * 60 * 24 * 7 * 28);// 半年
	public static final Long ttlMillis_30mins = new Long(1000 * 60 * 30);// 30分钟
	public static final Long ttlMillis_6hours = new Long(1000 * 60 * 60 * 6);// 6小时
	public static final Long ttlMillis_10mins = new Long(1000 * 60 * 10);// 10分钟
	public static final Long MAXTIME = Long.MAX_VALUE;
	public static final String order_by = "create_time";


	public static final String ENTERPRISE = "ZYZ";
	public static final Integer JWT_ERRCODE_EXPIRE = 410;// Token过期
	public static final Integer JWT_ERRCODE_FAIL = 510;// Token错误
	public static final String JWT_SECERT = "";




}
