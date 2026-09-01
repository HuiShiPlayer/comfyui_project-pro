package com.zyz.pojo;
import com.baomidou.mybatisplus.annotations.TableLogic;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.activerecord.Model;
import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotations.Version;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * <p>
 * VIEW
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-11
 */
@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class TaskC extends Model<TaskC> {

    private static final long serialVersionUID = 1L;

    private String taskName;
    private String taskId;
    /**
     * 0:图片；1:视频
     */
    private Integer type;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    @Override
    protected Serializable pkVal() {
        return null;
    }

}
