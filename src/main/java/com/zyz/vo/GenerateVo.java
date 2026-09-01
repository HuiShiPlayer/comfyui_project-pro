package com.zyz.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class GenerateVo {
    private String promptId;
    private Integer outputsNum;
    private String prompt;
    private Integer type;
    private String requestdata;
    private String localip;
    private String ip;
    private String port;
    private String comfyuiUrl;
    private String apiKey;
    private Integer classType;
}
