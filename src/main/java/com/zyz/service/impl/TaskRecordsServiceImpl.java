package com.zyz.service.impl;

import com.zyz.pojo.TaskRecords;
import com.zyz.mapper.TaskRecordsMapper;
import com.zyz.service.TaskRecordsService;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-30
 */
@Service
@Transactional
public class TaskRecordsServiceImpl extends ServiceImpl<TaskRecordsMapper, TaskRecords> implements TaskRecordsService {
	@Autowired
	TaskRecordsMapper TaskRecordsMapper;
	
	@Override
	public boolean resotreTaskRecords(String id) {
		return TaskRecordsMapper.resotreTaskRecords(id) > 0;
	}
}
