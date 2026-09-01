package com.zyz.controller;
import com.zyz.pojo.Config;
import com.zyz.pojo.TaskRecords;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.service.ConfigService;
import com.zyz.util.IdGen;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.TaskRecordsService;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.zyz.common.MyConst;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-30
 */
@RestController
@RequestMapping("/admin/taskRecords")
public class TaskRecordsController {
	@Autowired
	TaskRecordsService TaskRecordsServiceImpl;
	@Autowired
	ConfigService configService;
	/**
	 * 按照id查询 status为0的信息
	 */
	 @RequestMapping("/selectById")
	public ServerResponse<TaskRecords> getTaskRecords(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			TaskRecords selectById = TaskRecordsServiceImpl.selectById(id);
			if (selectById != null) {				
				return ServerResponse.createBySuccess(selectById);
			} else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}

	@RequestMapping("/selectByPage")
	public ServerResponse<Page<TaskRecords>> selectByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
													@RequestParam(defaultValue = MyConst.pageSize, name = "pageSize") Integer pageSize,
													@RequestParam(name = "name", required = false) String name) {
		Page<TaskRecords> page = new Page<TaskRecords>(pageNum, pageSize);
		EntityWrapper<TaskRecords> ew = new EntityWrapper<TaskRecords>();
		if (!StringUtils.isEmpty(name)) {
			ew.like("task_name", name);
		}


		ew.orderBy("create_time", false);
		Page<TaskRecords> selectPage = TaskRecordsServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}

	@RequestMapping("/selectByName")
	public ServerResponse<Object> selectByName(@RequestParam(defaultValue = "-1", name = "name") String name,Integer type) {
		List<TaskRecords> res=null;
		if("-1".equals(name)){
			res = TaskRecordsServiceImpl.selectList(new EntityWrapper<TaskRecords>().eq("type",type).orderBy("create_time",false));
		}else {
			res = TaskRecordsServiceImpl.selectList(new EntityWrapper<TaskRecords>().eq("type",type).like("task_name",name).orderBy("create_time",false));

		}
		if(CollectionUtils.isEmpty(res)){
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}else{
			return ServerResponse.createBySuccess(res);
		}
	}
	/**
	 * 添加信息
	 */
	@PostMapping("/insert")
	public ServerResponse<String> insertTaskRecords(@RequestBody TaskRecords info) throws Exception {

		if (info != null) {
			info.setCreateTime(new Date());
//			InetAddress localHost = InetAddress.getLocalHost();
//			// 返回IP地址字符串
//			String ip =  localHost.getHostAddress();
			Config config = configService.selectById(4);
			String ip = config.getUrl();
			info.setOriIp(ip);
			boolean insert = TaskRecordsServiceImpl.insert(info);
			if (insert)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 按照id修改 status为0的信息
	 */
	@PostMapping("/update")
	public ServerResponse<String> updateTaskRecords(TaskRecords info) throws Exception {
		if (info != null && info.getId() != null) {
//			InetAddress localHost = InetAddress.getLocalHost();
//			// 返回IP地址字符串
//			String ip =  localHost.getHostAddress();
			Config config = configService.selectById(4);
			String ip = config.getUrl();
			info.setOriIp(ip);
			boolean updateById = TaskRecordsServiceImpl.updateById(info);
			if (updateById)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	
	/**
	 * 逻辑删除
	 */
	@PostMapping("/delete")
	public ServerResponse<String> logicDeleteTaskRecords(TaskRecords info) {
		if (info != null && info.getId() != null) {
			boolean logicDelete = TaskRecordsServiceImpl.deleteById(info.getId());
			if (logicDelete)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	

	private String getTime(Date time){
		SimpleDateFormat sd=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		return sd.format(time);
	}
}

