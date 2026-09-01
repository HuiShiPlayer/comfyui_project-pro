package com.zyz.pojo;
import com.baomidou.mybatisplus.annotations.*;

import com.baomidou.mybatisplus.enums.FieldStrategy;
import com.baomidou.mybatisplus.enums.IdType;

import java.beans.Transient;
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
public class Api extends Model<Api> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String name;
    private String api;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    /**
     * 0：文生图；1文生视频；2图生视频；3首尾帧  4单图生图 5双图生图 6三图生图 7视频参考 8数字人
     *
     */
    private Integer type;
    private String tags;
    /*是否为默认api,每一个类型的api只有一个默认*/
    private Integer isDefault;
    private String outputsNum;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String startWords;
    private String endWords;
    private Integer classType;
    @TableField(strategy = FieldStrategy.IGNORED) // 允许更新null
    private String workflowId;

    @TableField(exist = false)
    private String apiKey;

    private Integer imgNum;
    private Integer audioNum;
    private Integer vedioNum;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}
