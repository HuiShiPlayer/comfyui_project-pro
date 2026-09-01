package com.zyz.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class LocalFiles {

    private String name;
    private String url;
    private Integer width;
    private Integer height;
    private Integer frames;
    private  Double frameRate;
    private Integer isAudio=0;

    protected Serializable pkVal() {
        return this.frames;
    }

}
