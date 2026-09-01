package com.zyz.mapper;
import com.zyz.vo.TaskVo;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.Task;
import com.baomidou.mybatisplus.mapper.BaseMapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-28
 */
public interface TaskMapper extends BaseMapper<Task> {
	@Update("update task set status=1 where id = #{id}")
	int resotreTask(String id);


	@Select("select DISTINCT task_id,task_name from task where type = 0")
	List<TaskVo> selectListGroupByTaskId();
	@Select("select DISTINCT task_id,task_name from task where type = 0 and task_name like CONCAT('%', #{name}, '%')")
	List<TaskVo> selectListGroupByTaskIdAndName(String name);
}
