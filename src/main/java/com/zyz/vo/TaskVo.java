package com.zyz.vo;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;


/**
 * <p>
 * 
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-28
 */
@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class TaskVo{

    private static final long serialVersionUID = 1L;


    private String taskName;

    private String taskId;


    protected Serializable pkVal() {
        return this.taskId;
    }

}
