package com.zyz.pojo;
import com.baomidou.mybatisplus.annotations.*;

import com.baomidou.mybatisplus.enums.FieldStrategy;
import com.baomidou.mybatisplus.enums.IdType;
import java.util.Date;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.activerecord.Model;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * <p>
 * 
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class Config extends Model<Config> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String name;
    @TableField(strategy = FieldStrategy.IGNORED) // 允许更新null
    private String url;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String tags;
    /**
     * 1启用；0未启用
     */
    private Integer type;
    private Integer operateType;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}
