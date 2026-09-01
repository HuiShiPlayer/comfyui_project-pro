package com.zyz.controller;
import com.zyz.pojo.Prompt;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.pojo.PromptClass;
import com.zyz.service.PromptClassService;
import com.zyz.util.IdGen;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.PromptService;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.zyz.common.MyConst;

import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-12-24
 */
@RestController
@RequestMapping("/admin/prompt")
public class PromptController {
	@Autowired
	PromptService PromptServiceImpl;
	@Autowired
	PromptClassService PromptClassServiceImpl;
	
	/**
	 * 按照id查询 status为0的信息
	 */
	 @RequestMapping("/selectById")
	public ServerResponse<Prompt> getPrompt(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			Prompt selectById = PromptServiceImpl.selectById(id);
			if (selectById != null) {				
				return ServerResponse.createBySuccess(selectById);
			} else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 分页查询

	 */
	@RequestMapping("/selectByPage")
	public ServerResponse<Page<Prompt>> getPromptByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
			@RequestParam(defaultValue = "10", name = "pageSize") Integer pageSize,
			@RequestParam(name = "name", required = false) String name,
														@RequestParam(required = false, name = "classId") Integer classId) {
		Page<Prompt> page = new Page<Prompt>(pageNum, pageSize);
		EntityWrapper<Prompt> ew = new EntityWrapper<Prompt>();
		if (!StringUtils.isEmpty(name)) {
			ew.like("name", name);
		}
		if(classId !=null && classId !=-1){
			ew.eq("class_id",classId);
		}

		ew.orderBy("create_time",false);
		Page<Prompt> selectPage = PromptServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}


	/**
	 * 添加信息
	 */
	@PostMapping("/insert")
	public ServerResponse<String> insertPrompt(Prompt info) {
		if(info != null){
			info.setCreateTime(new Date());
			if(info.getClassId() ==null || info.getClassId() == -1){
				info.setClassId(null);
				info.setClassName(null);
			}else{
				PromptClass promptClass = PromptClassServiceImpl.selectById(info.getClassId());
				if(promptClass != null){
					info.setClassName(promptClass.getName());
				}
			}
			boolean insert = PromptServiceImpl.insert(info);
			if (insert)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 按照id修改 status为0的信息
	 */
	@PostMapping("/update")
	public ServerResponse<String> updatePrompt(Prompt info) {
		if (info != null && info.getId() != null) {
			if(info.getClassId() ==null || info.getClassId() == -1){
				info.setClassId(null);
				info.setClassName(null);
			}else{
				PromptClass promptClass = PromptClassServiceImpl.selectById(info.getClassId());
				if(promptClass != null){
					info.setClassName(promptClass.getName());
				}
			}
			boolean updateById = PromptServiceImpl.updateById(info);
			if (updateById)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	@PostMapping("/removeImage")
	public ServerResponse<String> removeImage(Prompt info) {
		if(info == null || info.getId() == null){
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}else{
			info.setTips(null);
			boolean updateById = PromptServiceImpl.updateById(info);
			if (updateById)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}
	}
	
	/**
	 * 逻辑删除
	 */
	@PostMapping("/delete")
	public ServerResponse<String> logicDeletePrompt(Prompt info) {
		if (info != null && info.getId() != null) {
			boolean logicDelete = PromptServiceImpl.deleteById(info.getId());
			if (logicDelete)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 恢复数据
	 */
	@PostMapping("/resotre")
	public ServerResponse<String> resotrePrompt(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			boolean resotrePrompt = PromptServiceImpl.resotrePrompt(id);
			if (resotrePrompt)
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

