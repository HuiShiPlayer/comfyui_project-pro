package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.PromptClass;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-12-24
 */
public interface PromptClassMapper extends BaseMapper<PromptClass> {
	@Update("update prompt_class set status=1 where id = #{id}")
	int resotrePromptClass(String id);
}
