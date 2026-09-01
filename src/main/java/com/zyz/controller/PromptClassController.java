package com.zyz.controller;
import com.zyz.pojo.Prompt;
import com.zyz.pojo.PromptClass;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.service.PromptService;
import com.zyz.util.IdGen;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.PromptClassService;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
@RequestMapping("/admin/promptClass")
public class PromptClassController {
	@Autowired
	PromptClassService PromptClassServiceImpl;
	
	/**
	 * 按照id查询 status为0的信息
	 */
	 @RequestMapping("/selectById")
	public ServerResponse<PromptClass> getPromptClass(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			PromptClass selectById = PromptClassServiceImpl.selectById(id);
			if (selectById != null) {				
				return ServerResponse.createBySuccess(selectById);
			} else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}

	@RequestMapping("/getAll")
	public ServerResponse<List<PromptClass>> getAll() {

		List<PromptClass> res= PromptClassServiceImpl.selectList(new EntityWrapper<PromptClass>().orderBy("create_time",false));
		if (!CollectionUtils.isEmpty(res)) {
			return ServerResponse.createBySuccess(res);
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}
	
	/**
	 * 分页查询
	 * @param pageNum 页码默认1
	 * @param pageSize 每页容量默认10
	 * @param field 模糊查询字段
	 * @param value 模糊查询字段的值
	 * @param order 排序字段
	 */
	@RequestMapping("/selectByPage")
	public ServerResponse<Page<PromptClass>> getPromptClassByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
			@RequestParam(defaultValue = "10", name = "pageSize") Integer pageSize,
			@RequestParam(name = "field", required = false) String field,
			@RequestParam(name = "value", required = false) String value,
			@RequestParam(name = "order", required = false) String order) {
		Page<PromptClass> page = new Page<PromptClass>(pageNum, pageSize);
		EntityWrapper<PromptClass> ew = new EntityWrapper<PromptClass>();
		if (field == null && value != null) {
			ew.like("name", value);
		}
		if (field != null && value != null) {
			ew.like(field, value);
		}
		if (order != null) {
			ew.orderBy(order,false);
		}else{
		    ew.orderBy(MyConst.order_by,false);
		}
		Page<PromptClass> selectPage = PromptClassServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}
	
	
	/**
	 * 添加信息
	 */
	@PostMapping("/insert")
	public ServerResponse<String> insertPromptClass(PromptClass info) {
		if(info != null){
			info.setCreateTime(new Date());
			boolean insert = PromptClassServiceImpl.insert(info);
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
	public ServerResponse<String> updatePromptClass(PromptClass info) {
		if(info == null || StringUtils.isEmpty(info.getName())){
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}
		boolean res=false;
		if (info != null && info.getId() != null) {
			if(info.getId() == -1){
				info.setCreateTime(new Date());
				res = PromptClassServiceImpl.insert(info);
			}else{
				res = PromptClassServiceImpl.updateById(info);
				List<Prompt> prompts = PromptServiceImpl.selectList(new EntityWrapper<Prompt>().eq("class_id", info.getId()));
				for(Prompt item : prompts){
					item.setClassId(info.getId());
					item.setClassName(info.getName());
					PromptServiceImpl.updateById(item);
				}
			}

			if (res)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}

	@Autowired
	PromptService PromptServiceImpl;
	/**
	 * 逻辑删除
	 */
	@PostMapping("/delete")
	public ServerResponse<String> logicDeletePromptClass(PromptClass info) {
		if (info != null && info.getId() != null) {
			boolean logicDelete = PromptClassServiceImpl.deleteById(info.getId());
			if (logicDelete) {
				List<Prompt> prompts = PromptServiceImpl.selectList(new EntityWrapper<Prompt>().eq("class_id", info.getId()));
				for(Prompt item : prompts){
					item.setClassId(null);
					item.setClassName(null);
					PromptServiceImpl.updateById(item);
				}


				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());

			}else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 恢复数据
	 */
	@PostMapping("/resotre")
	public ServerResponse<String> resotrePromptClass(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			boolean resotrePromptClass = PromptClassServiceImpl.resotrePromptClass(id);
			if (resotrePromptClass)
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

