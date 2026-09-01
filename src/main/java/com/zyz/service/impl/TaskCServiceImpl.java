package com.zyz.service.impl;

import com.zyz.pojo.TaskC;
import com.zyz.mapper.TaskCMapper;
import com.zyz.service.TaskCService;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <p>
 * VIEW 服务实现类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-11
 */
@Service
@Transactional
public class TaskCServiceImpl extends ServiceImpl<TaskCMapper, TaskC> implements TaskCService {
	@Autowired
	TaskCMapper TaskCMapper;
	
	@Override
	public boolean resotreTaskC(String id) {
		return TaskCMapper.resotreTaskC(id) > 0;
	}
}
