package com.zyz.service;

import com.zyz.pojo.TaskRecords;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-30
 */
public interface TaskRecordsService extends IService<TaskRecords> {
	boolean resotreTaskRecords(String id);
}
