package com.zyz.controller;
import com.zyz.common.IpCache;
import com.zyz.config.CheckIPInit;
import com.zyz.pojo.Config;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.util.IdGen;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.ConfigService;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.zyz.common.MyConst;

import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
@RestController
@RequestMapping("/admin/config")
public class ConfigController {
	@Autowired
	ConfigService ConfigServiceImpl;


	/**
	 * 按照id查询 status为0的信息
	 */
	 @RequestMapping("/selectById")
	public ServerResponse<Config> getConfig(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			Config selectById = ConfigServiceImpl.selectById(id);
			if (selectById != null) {
				return ServerResponse.createBySuccess(selectById);
			} else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}

	/**
	 * 按照id查询 status为0的信息
	 */
	@RequestMapping("/getRemoteUrl")
	public ServerResponse<Object> getRemoteUrl(HttpServletRequest request, HttpServletResponse response, Object handler) throws UnknownHostException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		InetAddress localHost = InetAddress.getLocalHost();
        // 返回IP地址字符串
        String ip =  localHost.getHostAddress();
		int port = httpRequest.getLocalPort();

		String url = "http://"+ip+":"+port+"";
		return ServerResponse.createBySuccess(url);
	}

	/**
	 *
	 */
	@RequestMapping("/getAll")
	public ServerResponse<Object> getAll(HttpServletRequest request, HttpServletResponse response, Object handler) throws UnknownHostException {
		List<Config> datas = ConfigServiceImpl.selectList(new EntityWrapper<Config>().orderBy("id"));
		Config config =new Config();
		config.setId(9999);
		config.setName("手机版访问地址");
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		InetAddress localHost = InetAddress.getLocalHost();
		// 返回IP地址字符串
		String ip =  localHost.getHostAddress();
		int port = httpRequest.getLocalPort();

		String url = "http://"+ip+":"+port+""+"/web_comfyui_batch_operate/page/mobile/index.html";
		config.setTags(url);
		config.setUrl("~~点击右侧扫码~~");
		config.setType(0);
		config.setCreateTime(new Date());
		datas.add(config);
		return ServerResponse.createBySuccess(datas);
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
	public ServerResponse<Page<Config>> getConfigByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
			@RequestParam(defaultValue = "10", name = "pageSize") Integer pageSize,
			@RequestParam(name = "field", required = false) String field,
			@RequestParam(name = "value", required = false) String value,
			@RequestParam(name = "order", required = false) String order) {
		Page<Config> page = new Page<Config>(pageNum, pageSize);
		EntityWrapper<Config> ew = new EntityWrapper<Config>();
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
		Page<Config> selectPage = ConfigServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}

	/**
	 * 按照id修改 status为0的信息
	 */
	@RequestMapping("/updateByID")
	public ServerResponse<Object> updateByID (Config info) throws UnknownHostException {
		if(info == null){
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}

		boolean updateById = ConfigServiceImpl.updateById(info);
		if (updateById) {
			return ServerResponse.createBySuccess("配置成功");
		}else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}


	/**
	 * 按照id修改 status为0的信息
	 */
	@RequestMapping("/update")
	public ServerResponse<Object> updateConfig (Config info, HttpServletRequest request) throws UnknownHostException {
		if(info == null){
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		}
		if(info.getOperateType() ==1){
			info.setUrl("http://"+info.getUrl()+ ":"+  request.getLocalPort()+"/admin");
		}
		if(info.getOperateType() ==2){
			info.setUrl(info.getUrl().trim());
		}
		if(info.getOperateType() ==3){
			info.setUrl("ws://"+info.getUrl()+ ":"+ 8188+"/ws");
		}
		boolean updateById = ConfigServiceImpl.updateById(info);
		if (updateById) {
			Config config = ConfigServiceImpl.selectById(4);
			String ip = config.getUrl();
			String comfyuiUrl = ConfigServiceImpl.selectById(2).getUrl();
			IpCache.ipCache.put("comfyuiUrl",comfyuiUrl);


//        InetAddress localHost = InetAddress.getLocalHost();
//        // 返回IP地址字符串
//        String ip =  localHost.getHostAddress();

			ConfigServiceImpl.updateAllIPData(ip);
			return ServerResponse.createBySuccess(ConfigServiceImpl.selectList(null));
		}else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}


	

	

	private String getTime(Date time){
		SimpleDateFormat sd=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		return sd.format(time);
	}
}

