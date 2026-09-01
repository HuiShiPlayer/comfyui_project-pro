package com.zyz.service;

import com.zyz.pojo.TaskC;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 * VIEW 服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-11
 */
public interface TaskCService extends IService<TaskC> {
	boolean resotreTaskC(String id);
}
