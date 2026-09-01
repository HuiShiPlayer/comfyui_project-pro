package com.zyz.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/llama")
@Log
public class LlamaController extends BaseController{

    String path ="http://127.0.0.1:8080/";

    @RequestMapping("/load")
    public Object upload(String modelName) throws Exception {
        JSONObject obj =new JSONObject();
        obj.put("model",modelName);

        String s = doPostJson(path + "models/load", obj.toString());
        return  s;
    }
    @RequestMapping("/unload")
    public Object unload(String modelName) throws Exception {
        JSONObject obj =new JSONObject();
        obj.put("model",modelName);
        String s = doPostJson(path + "models/unload", obj.toString());
        return  s;
    }

    @RequestMapping("/prompt")
    public Object prompt(String modelName,String role,String prompt) throws Exception {
        JSONObject obj =new JSONObject();

        prompt = prompt +"。结果用可以直接解析的JSON数据格式返回,如 {prompts：[提示词1,提示词2,...]}";
        JSONObject system =new JSONObject();
        system.put("role","system");
        system.put("content",role);

        JSONObject user =new JSONObject();
        user.put("role","user");
        user.put("content",prompt);

        JSONArray array =new JSONArray();
        array.add(system);
        array.add(user);


        obj.put("model",modelName);
        obj.put("messages", array);
        obj.put("stream",false);
        log.info(obj.toString());
        String s = doPostJson(path + "/v1/chat/completions", obj.toString());


        return  JSONObject.parseObject(s).getJSONArray("choices").getJSONObject(0).getJSONObject("message").get("content");
    }

    @RequestMapping("/models")
    public Object models() throws Exception {
        return  JSONObject.parseObject(doGet(path + "v1/models",null));
    }
}
