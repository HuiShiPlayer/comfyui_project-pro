package com.zyz.common;

/**
 * Created by geely
 */
public enum ResponseCode {
    SUCCESS(200,"SUCCESS"),
    ERROR(500,"ERROR"),
    NEED_LOGIN(401,"NEED_LOGIN"),
    ILLEGAL_ARGUMENT(403,"ILLEGAL_ARGUMENT"),
    EXPIRE(1000,"服务器到其，请续费！");

    private final int code;
    private final String desc;


    ResponseCode(int code, String desc){
        this.code = code;
        this.desc = desc;
    }

    public int getCode(){
        return code;
    }
    public String getDesc(){
        return desc;
    }

}
