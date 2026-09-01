package com.zyz.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.zyz.common.ApiSource;
import com.zyz.common.IpCache;
import com.zyz.common.ServerResponse;
import com.zyz.config.SpringBootJarPathUtil;
import com.zyz.pojo.Config;
import com.zyz.pojo.GenerateRecords;
import com.zyz.pojo.ResourceLibrary;
import com.zyz.service.ConfigService;
import com.zyz.service.GenerateRecordsService;
import com.zyz.service.ResourceLibraryService;
import com.zyz.vo.GenerateVo;
import lombok.SneakyThrows;
import lombok.extern.java.Log;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/comfyui")
@Log
public class MobilePhoneController {
    public static ArrayList<GenerateVo> generatePool =new ArrayList<GenerateVo>();

    @Autowired
    SpringBootJarPathUtil springBootJarPathUtil;
    @Value("${isDev}")
    public Integer isDev;
    @Value("${outer.static.resources}")
    public String outerResources;

    private String uploadInputFilePath ;


    private String uploadOutputFilePath;

    @Autowired
    ConfigService configService;
    @Autowired
    GenerateRecordsService GenerateRecordsServiceImpl;
    private String baseRoorPath;
    @PostConstruct
    public void initResourcesPath(){
        if(isDev == 0){
            baseRoorPath = springBootJarPathUtil.getJarDirPath()+"/comfyui_static";
            uploadInputFilePath =  springBootJarPathUtil.getJarDirPath()+"/comfyui_static/input/";
            uploadOutputFilePath = springBootJarPathUtil.getJarDirPath()+"/comfyui_static/output/";
        }else{
            baseRoorPath = outerResources;
            uploadInputFilePath = outerResources+"/input/";
            uploadOutputFilePath = outerResources +"/output/";
        }
    }
    
    public static Integer isGenerating=0;
    public static Integer isWorking=0;

    public String getComfyuiUrl() {
        return IpCache.ipCache.get("comfyuiUrl");
    }


    public String doPostUploadRH(File file, String apiKey) throws Exception {
        HttpPost httpPost = new HttpPost(ApiSource.RH_UPLOAD_URL);
        // token 请求头
        httpPost.setHeader("Authorization", "Bearer " + apiKey);
        // 设置JSON请求体
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.addBinaryBody(
                "file",
                file,
                ContentType.DEFAULT_BINARY,
                file.getName()
        );
        HttpEntity multipart = builder.build();
        httpPost.setEntity(multipart);
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try (CloseableHttpClient client = httpClient;
             CloseableHttpResponse response = client.execute(httpPost)) {

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("POST JSON请求失败，状态码：" + response.getStatusLine().getStatusCode());
            }
            return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        } finally {
            httpPost.releaseConnection();
        }
    }

    public String doPostHistoryRh( String apiKey,String taskId) throws Exception {
        HttpPost httpPost = new HttpPost(ApiSource.RH_HISTORY_URL);
        // 设置JSON请求体
        JSONObject item = new JSONObject();
        item.put("taskId",taskId);
        StringEntity entity = new StringEntity(item.toJSONString(), ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization", "Bearer "+apiKey);
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(60000).setConnectTimeout(60000).build();
        httpPost.setConfig(requestConfig);
        // 执行请求
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try (CloseableHttpClient client = httpClient;
             CloseableHttpResponse response = client.execute(httpPost)) {

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("POST JSON请求失败，状态码：" + response.getStatusLine().getStatusCode());
            }
            return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        } finally {
            httpPost.releaseConnection();
        }
    }

    public String doPostJsonRh(String workFlowId, JSONArray nodeInfoList, String apiKey,String instanceType) throws Exception {
        HttpPost httpPost = new HttpPost(ApiSource.RH_API_URL+workFlowId);
        // 设置JSON请求体
//        String requestBody = String.format(
//                "{\"addMetadata\":true,\"nodeInfoList\":%s,\"instanceType\":"+instanceType+",\"usePersonalQueue\":\"false\"}",
//                nodeInfoList != null ? nodeInfoList : "[]"
//        );
        JSONObject requestBody =new JSONObject();
        requestBody.put("addMetadata",true);
        requestBody.put("nodeInfoList",nodeInfoList);
        requestBody.put("instanceType",instanceType);
        requestBody.put("usePersonalQueue",false);
        StringEntity entity = new StringEntity(requestBody.toJSONString(), ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        httpPost.setHeader("Content-Type", "application/json");
        httpPost.setHeader("Authorization", "Bearer "+apiKey);
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(60000).setConnectTimeout(60000).build();
        httpPost.setConfig(requestConfig);
        // 执行请求
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try (CloseableHttpClient client = httpClient;
             CloseableHttpResponse response = client.execute(httpPost)) {

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("POST JSON请求失败，状态码：" + response.getStatusLine().getStatusCode());
            }
            return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        } finally {
            httpPost.releaseConnection();
        }
    }
    /**
     * POST JSON请求（application/json）
     */
    public String doPostJson(String url, String jsonStr) throws Exception {
        HttpPost httpPost = new HttpPost(url);
        // 设置JSON请求体
        if (!StringUtils.isEmpty(jsonStr)) {
            StringEntity entity = new StringEntity(jsonStr, ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);
        }
        httpPost.setHeader("Content-Type", "application/json;charset=UTF-8");
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(60000).setConnectTimeout(60000).build();
        httpPost.setConfig(requestConfig);
        // 执行请求
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try (CloseableHttpClient client = httpClient;
             CloseableHttpResponse response = client.execute(httpPost)) {

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("POST JSON请求失败，状态码：" + response.getStatusLine().getStatusCode());
            }
            return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        } finally {
            httpPost.releaseConnection();
        }
    }
    public String doGet(String url, Map<String, String> params) throws Exception {
        // 构建带参数的URL
        URIBuilder uriBuilder = new URIBuilder(url);
        if (params != null && !params.isEmpty()) {
            params.forEach(uriBuilder::addParameter);
        }

        HttpGet httpGet = new HttpGet(uriBuilder.build());
        httpGet.setHeader("Content-Type", "application/json;charset=UTF-8");
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(60000).setConnectTimeout(60000).build();
        httpGet.setConfig(requestConfig);
        // 执行请求并自动释放资源
        CloseableHttpClient httpClient = HttpClients.createDefault();
        try (CloseableHttpClient client = httpClient;
             CloseableHttpResponse response = client.execute(httpGet)) {

            // 校验响应状态码
            if (response.getStatusLine().getStatusCode() != 200) {
                throw new RuntimeException("GET请求失败，状态码：" + response.getStatusLine().getStatusCode());
            }
            // 解析响应内容
            return EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
        } finally {
            httpGet.releaseConnection(); // 兜底释放连接
        }
    }

    @Autowired
    ResourceLibraryService resourceLibraryServiceImpl;
    @RequestMapping("/getResouces")
    public ServerResponse<Object> getResouces(Integer count,String prompt) throws Exception {
        JSONObject res =new JSONObject();
        JSONArray arr =new JSONArray();
        res.put("resources",arr);
        if(StringUtils.isEmpty(prompt)){
            res.put("prompt",null);
            return ServerResponse.createByErrorMessage("无关键词");
        }
        String rule = configService.selectById(9).getUrl();
        res.put("prompt",prompt.replaceAll(rule, "$1"));
        Pattern pattern = Pattern.compile(rule);
        Matcher matcher = pattern.matcher(prompt);
        int num =0;
        while (matcher.find()) {
            String content = matcher.group(1).trim();;
            ResourceLibrary resourceLibrary = resourceLibraryServiceImpl.selectOne(new EntityWrapper<ResourceLibrary>().like("name", content).orderBy("create_time", false));
            if(resourceLibrary!=null){
                num ++;
                Files.copy(
                        Paths.get(baseRoorPath+resourceLibrary.getLocalUrl()),
                        Paths.get(baseRoorPath+"/input/"+resourceLibrary.getLocalName()),
                        StandardCopyOption.REPLACE_EXISTING
                );
                arr.add("/input/"+resourceLibrary.getLocalName());
            }
            if(num>= count){
                break;
            }
        }
        if(arr.size()>0){
            return ServerResponse.createBySuccess(res);
        }else{
            return ServerResponse.createByErrorMessage("未匹配到资产");
        }

    }
    @RequestMapping("/upload2RH")
    public Object upload2RH(String name,String apiKey) throws Exception {
        if(StringUtils.isEmpty(name)||StringUtils.isEmpty(apiKey)){
            return ServerResponse.createByErrorMessage("参数为空");
        }
        String fileName= uploadInputFilePath+name;
        log.info(fileName);
        File file = new File(fileName);
        if(!new File(fileName).exists()){
            return ServerResponse.createByErrorMessage("文件不存在");
        }
        long length = file.length();
        if(length > 1024 * 1024*30){
            return ServerResponse.createByErrorMessage("文件大小超过30M");
        }
        return  ServerResponse.createBySuccess(doPostUploadRH(file,apiKey));
    }
    @RequestMapping("/rhprompt")
    public Object rhprompt(@RequestBody String jsonStr) throws Exception {
        if(isGenerating == 1){
            return ServerResponse.createByErrorMessage("入队中~");
        }
        log.info("prompt:" + jsonStr);
        JSONObject jsonObject = JSONObject.parseObject(jsonStr);
        JSONArray nodeInfoList = jsonObject.getJSONArray("nodeInfoList");
        String workflowId = jsonObject.getString("workflowId");
        String apiKey = jsonObject.getString("apiKey");
        String instanceType   =configService.selectById(8).getUrl().trim();
        return doPostJsonRh(workflowId,nodeInfoList,apiKey,instanceType);


    }

    @RequestMapping("/prompt")
    public Object prompt(@RequestBody String jsonStr) throws Exception {
        if(isGenerating == 1){
            return ServerResponse.createByErrorMessage("入队中~");
        }
        String comfyuiUrl = getComfyuiUrl();
        return ServerResponse.createBySuccess(doPostJson(comfyuiUrl + "/prompt", jsonStr));
    }

    @RequestMapping("/getResult")
    public Object getResult(@RequestBody String jsonStr, HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        try{
            isGenerating = 1;
            GenerateVo generateVo =new GenerateVo();
            String comfyuiUrl = getComfyuiUrl();
            String promptId = JSONObject.parseObject(jsonStr).getString("id");
            Integer outputsNum = JSONObject.parseObject(jsonStr).getInteger("outputsNum");
            String prompt = JSONObject.parseObject(jsonStr).getString("prompt");
            Integer type = JSONObject.parseObject(jsonStr).getInteger("type");
            String requestdata = JSONObject.parseObject(jsonStr).getString("requestdata");
            String apiKey = JSONObject.parseObject(jsonStr).getString("apiKey");

            Integer classType = JSONObject.parseObject(jsonStr).getInteger("defaultSource");
            String ip = IpCache.ipCache.get("ip");
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String port = new Integer(httpRequest.getLocalPort()).toString() ;
            Config config = configService.selectById(4);
            String localip = config.getUrl();
            generateVo.setComfyuiUrl(comfyuiUrl);
            generateVo.setPromptId(promptId);
            generateVo.setOutputsNum(outputsNum);
            generateVo.setPrompt(prompt);
            generateVo.setType(type);
            generateVo.setRequestdata(requestdata);
            generateVo.setIp(ip);
            generateVo.setPort(port);
            generateVo.setLocalip(localip);
            generateVo.setApiKey(apiKey);
            generateVo.setClassType(classType);
            generatePool.add(generateVo);
            callGenerateQueue();
        }catch (Exception e){
            log.info(e.getMessage());

        }finally {
            isGenerating = 0;
        }
        return ServerResponse.createBySuccess();
    }
    public void callGenerateQueue(){
        if(isWorking == 1){
            return;
        }else{
            if(!CollectionUtils.isEmpty(generatePool)){
                isWorking = 1;
                log.info("#############################开启线程################################");
                Thread thread = new Thread(){

                    @Override
                    public void run() {
                        try{
                            while(!CollectionUtils.isEmpty(generatePool)){
                                GenerateVo item = generatePool.remove(0);
                                Boolean isCon=true;
                                while(isCon){
                                    String res =null;
                                    if(item.getClassType() == 1){
                                        // String apiKey,String taskId
                                        res = doPostHistoryRh(item.getApiKey(), item.getPromptId());
                                        JSONObject taskInfo = JSONObject.parseObject(res);
                                        try{
                                            if("SUCCESS".equals(taskInfo.getString("status"))){
                                                isCon =false;
                                            }
                                            Thread.sleep(1000);

                                        }catch (Exception e){
                                            Thread.sleep(1000);
                                            continue;
                                        }
                                    }else if(item.getClassType() == 0 || item.getClassType() == 2){
                                        res = doGet(item.getComfyuiUrl() + "/history/" + item.getPromptId(), null);
                                        JSONObject taskInfo = JSONObject.parseObject(res);
                                        JSONObject nodeData =null;

                                        try{
                                            nodeData = taskInfo.getJSONObject(item.getPromptId());


                                            if(nodeData!=null && "success".equals( nodeData.getJSONObject("status").getString("status_str"))){
                                                isCon =false;
                                            }
                                            Thread.sleep(1000);

                                        }catch (Exception e){
                                            Thread.sleep(1000);
                                            continue;
                                        }
                                    }
                                }
                                String imageUrl =null;
                                String filename =null;
                                if(item.getClassType() == 1){
                                    String res = doPostHistoryRh(item.getApiKey(), item.getPromptId());
                                    JSONObject resultData = JSONObject.parseObject(res);
                                    //["results"][0].url
                                    imageUrl = resultData.getJSONArray("results").getJSONObject(0).getString("url");
                                    // that.prompt_id+"."+ resultData["results"][0].outputType
                                    filename = item.getPromptId()+"."+resultData.getJSONArray("results").getJSONObject(0).getString("outputType");
                                }else if(item.getClassType() == 0 || item.getClassType() == 2){
                                    String res = doGet(item.getComfyuiUrl() + "/history/" + item.getPromptId(), null);
                                    JSONObject resultData = JSONObject.parseObject(res);
                                    JSONObject image=null;
                                    try{
                                        image = resultData.getJSONObject(item.getPromptId()).getJSONObject("outputs").getJSONObject("" + item.getOutputsNum()).getJSONArray("images").getJSONObject(0);
                                    }catch (Exception e){
                                        image = resultData.getJSONObject(item.getPromptId()).getJSONObject("outputs").getJSONObject("" + item.getOutputsNum()).getJSONArray("gifs").getJSONObject(0);
                                    }
                                    filename = image.getString("filename");
                                    String subfolder = image.getString("subfolder");

                                    imageUrl = getComfyuiUrl()+"/view?filename="+filename+"&subfolder="+subfolder+"&type=output";
                                    imageUrl = encodeUrl(imageUrl);

                                }
                                String imageFullName = downloadFileByurl(imageUrl, filename);

                                String name = imageFullName.split("\\.")[0];


                                imageFullName="http://"+item.getIp()+":"+item.getPort()+"/"+imageFullName;
                                GenerateRecords info =new GenerateRecords();
                                info.setName(name);
                                info.setType(item.getType());
                                info.setPrompt(item.getPrompt());
                                info.setCreateTime(new Date());
                                info.setUrl(imageFullName);
                                if(!StringUtils.isEmpty(item.getRequestdata()))
                                    info.setReference(item.getRequestdata());
                                info.setOriIp(item.getLocalip());
                                log.info("info:"+info.toString());
                                GenerateRecordsServiceImpl.insert(info);


                            }
                        }catch (Exception e){
                            log.warning(e.getMessage());
                        }finally {
                            isWorking = 0;
                        }
                    }
                };
                thread.start();

            }
        }
    }

    public String downloadFileByurl(String fileUrl,String fileName) throws Exception {

       
        try {
            // 建立图片连接
            URL url = new URL(fileUrl);

            HttpURLConnection connection = (HttpURLConnection)url.openConnection();
            //设置请求方式
            connection.setRequestMethod("GET");
            //设置超时时间
            connection.setConnectTimeout(10*1000);

            //输入流
            InputStream stream = connection.getInputStream();
            int len = 0;
            byte[] test = new byte[1024];

            //设置图片名称，这个随意，我是用的当前时间命名
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyymmddhhmmss");


            //输出流，图片输出的目的文件
            BufferedOutputStream fos = new BufferedOutputStream(new FileOutputStream(uploadOutputFilePath  + fileName));

            //以流的方式上传
            while ((len =stream.read(test)) !=-1){
                fos.write(test,0,len);
            }


            //记得关闭流，不然消耗资源
            stream.close();
            fos.close();
            return "output/"+fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "上传失败";
        }
    }
    public static String encodeUrl(String rawUrl) {
        return  rawUrl.replace(" ", "%20");
    }
}
