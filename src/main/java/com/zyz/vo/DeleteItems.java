package com.zyz.vo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.List;

@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class DeleteItems {
    private static final long serialVersionUID = 1L;


    private List<Integer> ids;

    private Integer type =0;


    protected Serializable pkVal() {
        return this.type;
    }
}
