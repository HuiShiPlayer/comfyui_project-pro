package com.zyz.controller;
import com.alibaba.fastjson.JSONObject;
import com.zyz.config.SpringBootJarPathUtil;
import com.zyz.pojo.Config;
import com.zyz.pojo.GenerateRecords;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.service.ConfigService;
import com.zyz.util.IdGen;
import com.zyz.vo.DeleteItems;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.GenerateRecordsService;

import java.io.File;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.zyz.common.MyConst;

import javax.annotation.PostConstruct;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-01
 */
@RestController
@RequestMapping("/admin/generateRecords")
@Log
public class GenerateRecordsController {
	@Autowired
	SpringBootJarPathUtil springBootJarPathUtil;
	@Autowired
	GenerateRecordsService GenerateRecordsServiceImpl;
	@Value("${isDev}")
	public Integer isDev;
	@Value("${outer.static.resources}")
	public String outerResources;

	@Autowired
	ConfigService configService;

    private String uploadInputFilePath;


    private String uploadOutputFilePath;


	@PostConstruct
	public void initResourcesPath(){
		if(isDev == 0){
			uploadInputFilePath =  springBootJarPathUtil.getJarDirPath()+"/comfyui_static/input/";
			uploadOutputFilePath = springBootJarPathUtil.getJarDirPath()+"/comfyui_static/output/";
		}else{
			uploadInputFilePath = outerResources+"/input/";
			uploadOutputFilePath = outerResources +"/output/";
		}
	}
	/**
	 * 按照id查询 status为0的信息
	 */
	 @RequestMapping("/selectById")
	public ServerResponse<GenerateRecords> getGenerateRecords(@RequestParam(defaultValue = "-1", name = "id") String id) {
		if (!"-1".equals(id)) {
			GenerateRecords selectById = GenerateRecordsServiceImpl.selectById(id);
			if (selectById != null) {				
				return ServerResponse.createBySuccess(selectById);
			} else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	
	/**
	 * 分页查询
	 * @param pageNum 页码默认1
	 * @param pageSize 每页容量默认10
	 */
	@RequestMapping("/selectByPage")
	public ServerResponse<Page<GenerateRecords>> getGenerateRecordsByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
			@RequestParam(defaultValue = "10", name = "pageSize") Integer pageSize
			) {
		Page<GenerateRecords> page = new Page<GenerateRecords>(pageNum, pageSize);
		EntityWrapper<GenerateRecords> ew = new EntityWrapper<GenerateRecords>();
		ew.orderBy(MyConst.order_by,false);

		Page<GenerateRecords> selectPage = GenerateRecordsServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}
	
	
	/**
	 * 添加信息
	 */
	@PostMapping("/insert")
	public ServerResponse<String> insertGenerateRecords(GenerateRecords info) throws Exception {
		if(info != null){
//			InetAddress localHost = InetAddress.getLocalHost();
//			String ip =  localHost.getHostAddress();
			// 返回IP地址字符串
			Config config = configService.selectById(4);
			String ip = config.getUrl();

			info.setOriIp(ip);
			info.setCreateTime(new Date());
			boolean insert = GenerateRecordsServiceImpl.insert(info);
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
	public ServerResponse<String> updateGenerateRecords(GenerateRecords info) throws Exception {
		if (info != null && info.getId() != null) {
//			InetAddress localHost = InetAddress.getLocalHost();
//			// 返回IP地址字符串
//			String ip =  localHost.getHostAddress();
			Config config = configService.selectById(4);
			String ip = config.getUrl();
			info.setOriIp(ip);
			boolean updateById = GenerateRecordsServiceImpl.updateById(info);
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
	public ServerResponse<String> logicDeleteGenerateRecords(Integer id,@RequestParam(required = false,defaultValue = "0") Integer type) {
		if (id != null) {
			boolean logicDelete=false;
            boolean res=true;
			if(type == 1){
                res = deleteLocalFile(id);
            }
			logicDelete= GenerateRecordsServiceImpl.deleteById(id);
			if (logicDelete && res)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}

	@PostMapping("/batchdelete")
	public ServerResponse<String> batchdelete(@RequestBody DeleteItems deleteItems) {
		if(CollectionUtils.isEmpty(deleteItems.getIds())){
			return ServerResponse.createByErrorMessage("请选择删除资源");
		}
		boolean b = false;
        boolean res=true;
        if(deleteItems.getType() == 1){
            res = deleteLocalFiles(deleteItems.getIds());
        }
        b = GenerateRecordsServiceImpl.deleteBatchIds(deleteItems.getIds());
		if (b && res)
			return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
		else
			return ServerResponse.createByErrorMessage("删除失败");
	}

	private boolean deleteLocalFile(Integer id){
        try{
            GenerateRecords record = GenerateRecordsServiceImpl.selectById(id);
            if(record!=null){
                String url = record.getUrl();
                String outputFileName = getUrlFileName(url);
                //删除 output 文件
                String outputFilePaht = uploadOutputFilePath +outputFileName;
                deleteLocalFile(outputFilePaht);

                //删除input中的值
                String reference = record.getReference();
                if(!StringUtils.isEmpty(reference)){
                    JSONObject jsonObject = JSONObject.parseObject(reference);
                    Map<String, Object> map = jsonObject.getInnerMap();
                    // 遍历Map并获取每个值
                    for (Map.Entry<String, Object> entry : map.entrySet()) {
                        String inputFileName = (String)entry.getValue();
                        inputFileName = getUrlFileName(inputFileName);
                        String inputFilePaht = uploadInputFilePath+inputFileName;
                        deleteLocalFile(inputFilePaht);
                    }
                }

            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    private boolean deleteLocalFiles(List<Integer> ids){
	    try{
            List<GenerateRecords> records = GenerateRecordsServiceImpl.selectBatchIds(ids);
            if(!CollectionUtils.isEmpty(records)){
                for(GenerateRecords record : records){
                    String url = record.getUrl();
                    String outputFileName = getUrlFileName(url);
                    //删除 output 文件
                    String outputFilePaht = uploadOutputFilePath +outputFileName;
                    deleteLocalFile(outputFilePaht);


                    //删除input中的值
                    String reference = record.getReference();
                    if(!StringUtils.isEmpty(reference)){
                        JSONObject jsonObject = JSONObject.parseObject(reference);
                        Map<String, Object> map = jsonObject.getInnerMap();
                        // 遍历Map并获取每个值
                        for (Map.Entry<String, Object> entry : map.entrySet()) {
                            String inputFileName = (String)entry.getValue();
                            inputFileName = getUrlFileName(inputFileName);
                            String inputFilePaht = uploadInputFilePath+inputFileName;
                            deleteLocalFile(inputFilePaht);
                        }
                    }
                }
            }
	        return true;
        }catch (Exception e){
	        e.printStackTrace();
	        return false;
        }


    }
	
    private boolean deleteLocalFile(String path){
	    File file = new File(path);
        if (file.exists()) {
            try {
                // 如果文件存在，则删除文件
                file.delete();
                return true;
            } catch (Exception e) {
                return false;
            }
        } else {
            log.info("文件："+path+" 不存在");
            return true;
        }
    }

	private String getTime(Date time){
		SimpleDateFormat sd=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		return sd.format(time);
	}

	private String getUrlFileName(String url){
        String[] split = url.split("/");
        String name = split[split.length - 1];
        return name;
    }

}

