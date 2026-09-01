package com.zyz.pojo;
import com.baomidou.mybatisplus.annotations.TableLogic;

import com.baomidou.mybatisplus.enums.IdType;
import java.util.Date;
import com.baomidou.mybatisplus.annotations.TableId;
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
 * @since 2025-12-24
 */
@Data
@Slf4j
@NoArgsConstructor
@SuppressWarnings("all")
@EqualsAndHashCode(callSuper = false)
public class PromptClass extends Model<PromptClass> {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String name;
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String tips;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}
