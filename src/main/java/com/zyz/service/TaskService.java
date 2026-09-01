package com.zyz.service;

import com.zyz.pojo.Task;
import com.baomidou.mybatisplus.service.IService;
import com.zyz.vo.TaskVo;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-28
 */
public interface TaskService extends IService<Task> {
	boolean resotreTask(String id);
	boolean insertImageTask(List<Task> infos);
    List<TaskVo> selectListGroupByTaskId(String name);
}
