package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.Prompt;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-12-24
 */
public interface PromptMapper extends BaseMapper<Prompt> {
	@Update("update prompt set status=1 where id = #{id}")
	int resotrePrompt(String id);
}
