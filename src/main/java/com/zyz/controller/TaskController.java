package com.zyz.controller;

import com.alibaba.fastjson.JSONObject;
import com.zyz.common.SystemInfoConst;
import com.zyz.pojo.Config;
import com.zyz.pojo.Task;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.service.ConfigService;
import com.zyz.util.IdGen;
import com.zyz.vo.TaskVo;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.TaskService;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.zyz.common.MyConst;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2025-10-28
 */
@RestController
@RequestMapping("/admin/task")
public class TaskController {
    @Autowired
    TaskService TaskServiceImpl;
    @Autowired
    ConfigService configService;
    /**
     * 按照id查询 status为0的信息
     */
    @RequestMapping("/selectById")
    public ServerResponse<Task> getTask(@RequestParam(defaultValue = "-1", name = "id") String id) {
        if (!"-1".equals(id)) {
            Task selectById = TaskServiceImpl.selectById(id);
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
     * @param field    模糊查询字段
     * @param value    模糊查询字段的值
     * @param order    排序字段
     */
    @RequestMapping("/selectByPage")
    public ServerResponse<Page<Task>> getTaskByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
                                                    @RequestParam(defaultValue = SystemInfoConst.pageSize, name = "pageSize") Integer pageSize,
                                                    @RequestParam(name = "field", required = false) String field,
                                                    @RequestParam(name = "value", required = false) String value,
                                                    @RequestParam(name = "order", required = false) String order) {
        Page<Task> page = new Page<Task>(pageNum, pageSize);
        EntityWrapper<Task> ew = new EntityWrapper<Task>();
        if (field == null && value != null) {
            ew.like("name", value);
        }
        if (field != null && value != null) {
            ew.like(field, value);
        }
        if (order != null) {
            ew.orderBy(order, false);
        } else {
            ew.orderBy(MyConst.order_by, false);
        }
        Page<Task> selectPage = TaskServiceImpl.selectPage(page, ew);
        if (selectPage.getRecords().size() != 0)
            return ServerResponse.createBySuccess(selectPage);
        else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

    }


    /**
     * 添加信息
     */
    @PostMapping("/insert")
    public ServerResponse<String> insert(@RequestBody List<Task> infos) throws Exception {

        if (CollectionUtils.isEmpty(infos)) {
            return ServerResponse.createBySuccess("队列为空");
        }
//        InetAddress localHost = InetAddress.getLocalHost();
//        String ip =  localHost.getHostAddress();
        // 返回IP地址字符串
        Config config = configService.selectById(4);
        String ip = config.getUrl();

        Date date = new Date();
        String task_id = IdGen.uuid();
        for (Task task : infos) {
            task.setTaskId(task_id);
            task.setCreateTime(date);
            task.setOriIp(ip);
        }

        boolean insert = TaskServiceImpl.insertImageTask(infos);
        if (insert)
            return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
        else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

    }

    /**
     * 按照id修改 status为0的信息
     */
    @PostMapping("/update")
    public ServerResponse<String> updateTask(Task info) throws UnknownHostException {
        if (info != null && info.getId() != null) {
//            InetAddress localHost = InetAddress.getLocalHost();
//            // 返回IP地址字符串
//            String ip =  localHost.getHostAddress();
            Config config = configService.selectById(4);
            String ip = config.getUrl();
            info.setOriIp(ip);
            boolean updateById = TaskServiceImpl.updateById(info);
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
    public ServerResponse<String> logicDeleteTask(String taskId) {
        if (!StringUtils.isEmpty(taskId)) {
            boolean logicDelete = TaskServiceImpl.delete(new EntityWrapper<Task>().eq("task_id",taskId));
            if (logicDelete)
                return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
            else
                return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        } else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
    }



    @RequestMapping("/selectByName")
    public ServerResponse<Object> selectByName(@RequestParam(defaultValue = "-1", name = "name") String name) {
        List<TaskVo> tasks= TaskServiceImpl.selectListGroupByTaskId(name);
        if (!CollectionUtils.isEmpty(tasks)) {
            return ServerResponse.createBySuccess(tasks);
        } else
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
    }

    @RequestMapping("/selectByTaskId")
    public ServerResponse<Object> selectByTaskId(@RequestBody String data) {
        if(StringUtils.isEmpty(data))
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        Map<String,String> map = JSONObject.parseObject(data, Map.class);
        String taskId = map.get("taskId");
        if(StringUtils.isEmpty(taskId)){
           return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
       }else{
           List<Task> tasks = TaskServiceImpl.selectList(new EntityWrapper<Task>().eq("task_id", taskId).orderBy("id",true));
           if (!CollectionUtils.isEmpty(tasks)) {
               return ServerResponse.createBySuccess(tasks);
           } else
               return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
       }
    }


}

