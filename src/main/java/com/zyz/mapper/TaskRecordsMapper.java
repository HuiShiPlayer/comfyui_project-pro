package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.TaskRecords;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-30
 */
public interface TaskRecordsMapper extends BaseMapper<TaskRecords> {
	@Update("update task_records set status=1 where id = #{id}")
	int resotreTaskRecords(String id);
}
