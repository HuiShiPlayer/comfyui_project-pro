package com.zyz.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zyz.bo.NodeInfo;
import com.zyz.common.*;
import com.zyz.pojo.Api;
import com.zyz.pojo.Config;
import com.zyz.service.ConfigService;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.ApiService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
@RestController
@RequestMapping("/admin/api")
public class ApiController {
    @Autowired
    ApiService ApiServiceImpl;
    @Autowired
    ConfigService ConfigServiceImpl;

    @PostMapping("/synchronizeData") // 与表单的action属性匹配
    public ServerResponse<Object> synchronizeData(@RequestParam("file") MultipartFile file)  throws Exception {

        if (file.isEmpty()) {
            return ServerResponse.createByErrorMessage("请添加上传文件");
        }
        String filename = file.getOriginalFilename();
        if(filename == null || !filename.endsWith(".json")){
            return ServerResponse.createByErrorMessage("文件不正确");
        }
        try (InputStream inputStream = file.getInputStream();
             // 重点：StandardCharsets.UTF_8，不要使用平台默认编码
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String jsonStr = sb.toString();
            JSONArray arr = JSONObject.parseObject(jsonStr).getJSONArray("RECORDS");
            for(int i = 0 ;i<arr.size();i++){
                Api api = arr.getObject(i,Api.class);
                api.setId(null);
                ApiServiceImpl.insert(api);
            }

            return ServerResponse.createBySuccess("同步成功");
        }catch (Exception e){
            return ServerResponse.createByErrorMessage("操作失败");
        }
    }


    @RequestMapping("/getDefalutApi")
    public ServerResponse< Object> getDefalutApi(Integer type) throws Exception {
        if(type!=null){
            Config config = ConfigServiceImpl.selectById(7);
            Integer classType = 0;
            String msg="请设置默认API";
            if(config.getUrl().equals(ApiSource.comfyui)){
                classType = 0;
                msg="请设置Comfyui默认API";
            }else if(config.getUrl().equals(ApiSource.runningHub)){
                classType =1;
                msg="请设置RunningHub默认API";
            }else if(config.getUrl().equals(ApiSource.cloudPlatform)){
                classType =2;
                msg="请设置云平台默认API";
            }
            Api api = ApiServiceImpl.selectOne(new EntityWrapper<Api>().eq("type", type).eq("is_default", 1).eq("class_type", classType));
            if(api!=null && (classType ==0 || classType ==2)){
                // 执行替换：$1引用捕获组提取的中间内容
                api.setApi(api.getApi().replaceAll("\"###\\{\\{\\[\\[(.*?)\\]\\]\\}\\}\\###\"", "$1"));
                api.setApi(api.getStartWords() + api.getApi()+api.getEndWords());
                return ServerResponse.createBySuccess(api);
            }else if(api!=null && classType ==1){
                List<NodeInfo> convert = ComfyUIToRunningHub.convert(api.getApi());
                String rh = com.alibaba.fastjson2.JSONArray.from(convert).toJSONString();
//                System.out.println(rh);
                api.setApi(rh.replaceAll("\"###\\{\\{\\[\\[(.*?)\\]\\]\\}\\}\\###\"", "$1"));
//                System.out.println(api.getApi());

                api.setApi(api.getStartWords() + api.getApi()+api.getEndWords());
                String RUNNINGHUB_API_KEY = ConfigServiceImpl.selectById(6).getUrl();
                api.setApiKey(RUNNINGHUB_API_KEY);
                return ServerResponse.createBySuccess(api);
            }else{
                return ServerResponse.createByErrorMessage(msg);
            }
        }else
            return ServerResponse.createByErrorMessage("参数有误！");
    }
    @RequestMapping("/getApi")
    public ServerResponse<List<Api>> getApi(@RequestParam(name = "type", required = false) Integer type,@RequestParam(name = "name", required = false) String name,@RequestParam(name = "classType", required = false) Integer classType) {

        EntityWrapper<Api> ew = new EntityWrapper<Api>();

        if (type != null && type != -1) {
            ew.eq("type", type);
        }
        if (classType!=null) {
            ew.eq("class_type", classType);
        }
        if (!StringUtils.isEmpty(name)) {
            ew.like("name", name);
        }
        ew.orderBy("update_time", false);
        List<Api> apis= ApiServiceImpl.selectList(ew);
        if (!CollectionUtils.isEmpty(apis))
            return ServerResponse.createBySuccess(apis);
        else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

    }


    @RequestMapping("/updateDefaultStatus")
    public ServerResponse<Api> updateDefaultStatus(Integer id,Integer status,Integer type,Integer classType) {
        if(id == null || status ==null || type ==null || classType ==null){
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }else{
            if (status == 1) {
                List<Api> res=ApiServiceImpl.selectList(new EntityWrapper<Api>().eq("type", type).eq("class_type", classType));
                for(Api item : res){
                    item.setIsDefault(0);
                }
                if(!CollectionUtils.isEmpty(res)){
                    ApiServiceImpl.updateBatchById(res);
                }
            }
            Api api = ApiServiceImpl.selectById(id);
            api.setIsDefault(status);
            boolean res = ApiServiceImpl.updateById(api);
            if (res)
                return ServerResponse.createBySuccess(api);
            else
                return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }

    }
    /**
     * 按照id查询 status为0的信息
     */
    @RequestMapping("/selectById")
    public ServerResponse<Api> getApi(@RequestParam(defaultValue = "-1", name = "id") String id) {
        if (!"-1".equals(id)) {
            Api selectById = ApiServiceImpl.selectById(id);
            if (selectById != null) {
                return ServerResponse.createBySuccess(selectById);
            } else
                return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        } else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
    }

    /**
     * 分页查询
     *
     * @param pageNum  页码默认1
     * @param pageSize 每页容量默认10

     */
    @RequestMapping("/selectByPage")
    public ServerResponse<Page<Api>> getApiByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
                                                  @RequestParam(defaultValue = MyConst.pageSize, name = "pageSize") Integer pageSize,
                                                  @RequestParam(name = "name", required = false) String name,
                                                  @RequestParam(name = "type", required = false) Integer type,
                                                  @RequestParam(name = "classType", required = false) Integer classType) {
        Page<Api> page = new Page<Api>(pageNum, pageSize);
        EntityWrapper<Api> ew = new EntityWrapper<Api>();
        if (!StringUtils.isEmpty(name)) {
            ew.like("name", name);
        }
        if (type != null && type != -1) {
            ew.eq("type", type);
        }
        if (classType != null && classType != -1) {
            ew.eq("class_type", classType);
        }
        ew.orderBy("update_time", false);
        Page<Api> selectPage = ApiServiceImpl.selectPage(page, ew);
        if (selectPage.getRecords().size() != 0)
            return ServerResponse.createBySuccess(selectPage);
        else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

    }



    /**
     * 添加信息
     */
    @PostMapping("/insert")
    public ServerResponse<String> insertApi(Api info) {
        if (info != null) {

            info.setCreateTime(new Date());
            info.setOutputsNum(info.getOutputsNum().trim());
            if (info.getIsDefault() == 1) {
                List<Api> res=ApiServiceImpl.selectList(new EntityWrapper<Api>().eq("type", info.getType()).eq("class_type", info.getClassType()));
                for(Api item : res){
                	item.setIsDefault(0);
				}
                if(!CollectionUtils.isEmpty(res)){
					ApiServiceImpl.updateBatchById(res);
				}
            }else{
                Integer type = ApiServiceImpl.selectCount(new EntityWrapper<Api>().eq("type", info.getType()).eq("is_default",1).eq("class_type", info.getClassType()));
                if(type == null || type == 0){
                    info.setIsDefault(1);
                }
            }

            boolean insert = ApiServiceImpl.insert(info);
            if (insert) {

                return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
            } else
                return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        } else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
    }

    /**
     * 按照id修改 status为0的信息
     */
    @PostMapping("/update")
    public ServerResponse<String> updateApi(Api info) {
        if (info != null && info.getId() != null) {

            if (info.getIsDefault() == 1) {
                List<Api> res=ApiServiceImpl.selectList(new EntityWrapper<Api>().eq("type", info.getType()).eq("class_type", info.getClassType()));
                for(Api item : res){
                    item.setIsDefault(0);
                }
                if(!CollectionUtils.isEmpty(res)){
                    ApiServiceImpl.updateBatchById(res);
                }
            }
            boolean updateById = ApiServiceImpl.updateById(info);
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
    public ServerResponse<String> logicDeleteApi(Api info) {
        if (info != null && info.getId() != null) {
            boolean logicDelete = ApiServiceImpl.deleteById(info.getId());
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
    public ServerResponse<String> resotreApi(@RequestParam(defaultValue = "-1", name = "id") String id) {
        if (!"-1".equals(id)) {
            boolean resotreApi = ApiServiceImpl.resotreApi(id);
            if (resotreApi)
                return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
            else
                return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        } else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
    }

    private String getTime(Date time) {
        SimpleDateFormat sd = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        return sd.format(time);
    }
}

