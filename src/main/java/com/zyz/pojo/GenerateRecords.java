package com.zyz.pojo;
import com.baomidou.mybatisplus.annotations.TableLogic;

import java.util.Date;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.activerecord.Model;
import java.io.Serializable;

import com.baomidou.mybatisplus.annotations.Version;
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
 * @since 2025-11-01
 */
@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class GenerateRecords extends Model<GenerateRecords> {

    private static final long serialVersionUID = 1L;
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String prompt;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    /**
     * 0:图片；1:视频
     */
    private Integer type;
    private String url;
    private String name;
    private String reference;

    private String oriIp;
    @Override
    protected Serializable pkVal() {
        return null;
    }

}
