package com.zyz.service.impl;

import com.zyz.pojo.Task;
import com.zyz.mapper.TaskMapper;
import com.zyz.service.TaskService;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.zyz.vo.TaskVo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-28
 */
@Service
@Transactional
public class TaskServiceImpl extends ServiceImpl<TaskMapper, Task> implements TaskService {
	@Autowired
	TaskMapper TaskMapper;


    public List<TaskVo> selectListGroupByTaskId(String name){
        if("-1".equals(name)){
            return TaskMapper.selectListGroupByTaskId();
        }else{
            return TaskMapper.selectListGroupByTaskIdAndName(name);
        }
    }
	@Override
	public boolean resotreTask(String id) {
		return TaskMapper.resotreTask(id) > 0;
	}

	public boolean insertImageTask(List<Task> infos){
		for(Task item :infos){
			TaskMapper.insert(item);
		}
		return true;

	}
}
