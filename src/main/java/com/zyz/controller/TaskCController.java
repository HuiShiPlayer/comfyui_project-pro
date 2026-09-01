package com.zyz.controller;
import com.zyz.pojo.TaskC;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.util.IdGen;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.TaskCService;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.zyz.common.MyConst;

import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * VIEW 前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-11
 */
@RestController
@RequestMapping("/admin/taskC")
public class TaskCController {
	@Autowired
	TaskCService TaskCServiceImpl;
	

	/**
	 * 分页查询
	 * @param pageNum 页码默认1
	 * @param pageSize 每页容量默认10

	 */
	@RequestMapping("/selectByPage")
	public ServerResponse<Page<TaskC>> selectByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
												   @RequestParam(defaultValue = MyConst.pageSize, name = "pageSize") Integer pageSize,
												   @RequestParam(name = "name", required = false) String name) {
		Page<TaskC> page = new Page<TaskC>(pageNum, pageSize);
		EntityWrapper<TaskC> ew = new EntityWrapper<TaskC>();
		if (!StringUtils.isEmpty(name)) {
			ew.like("task_name", name);
		}


		ew.orderBy("create_time", false);
		Page<TaskC> selectPage = TaskCServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}
	
	



	private String getTime(Date time){
		SimpleDateFormat sd=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		return sd.format(time);
	}
}

