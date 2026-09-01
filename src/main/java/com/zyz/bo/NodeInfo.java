package com.zyz.bo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public  class NodeInfo {
    private String nodeId;
    private String fieldName;
    private String fieldValue;
    // getters and setters
}