package com.zyz.vo;

public class FileInfo {
    public String name;
    public long lastModifiedTime;

    public FileInfo(String name, long lastModifiedTime) {
        this.name = name;
        this.lastModifiedTime = lastModifiedTime;
    }
}
