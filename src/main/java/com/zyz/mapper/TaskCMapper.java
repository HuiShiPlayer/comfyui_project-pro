package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.TaskC;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 * VIEW Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-11
 */
public interface TaskCMapper extends BaseMapper<TaskC> {
	@Update("update task_c set status=1 where id = #{id}")
	int resotreTaskC(String id);
}
