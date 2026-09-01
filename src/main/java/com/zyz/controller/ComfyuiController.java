package com.zyz.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zyz.common.IpCache;

import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.common.TaskCache;
import com.zyz.config.SpringBootJarPathUtil;
import com.zyz.pojo.Config;
import com.zyz.service.ConfigService;
import com.zyz.util.IdGen;
import com.zyz.util.UrlFileExtensionUtil;
import com.zyz.vo.CapCutVo;
import lombok.extern.java.Log;
import org.apache.commons.io.FilenameUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.swing.filechooser.FileSystemView;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/comfyui")
@Log
public class ComfyuiController extends BaseController{
    @Autowired
    ConfigService configService;

    @Value("${isDev}")
    public Integer isDev;
    @Value("${outer.static.resources}")
    public String outerResources;

    private String uploadInputFilePath ;
    @Autowired
    SpringBootJarPathUtil springBootJarPathUtil;

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
    @RequestMapping("/clearTask")
    public synchronized Object clearTask(@RequestBody List<String> taskKeys, HttpServletRequest request) throws Exception {
        if(CollectionUtils.isEmpty(taskKeys)){
            return ServerResponse.createByErrorMessage("为传入taskKeys");
        }
        if(CollectionUtils.isEmpty(TaskCache.completeTasksPool)){
            return ServerResponse.createByErrorMessage("没有完成的任务");
        }
        List<JSONObject> undoTasksPool = new ArrayList<JSONObject>();
        List<JSONObject> runningTasksPool = new ArrayList<JSONObject>();
        List<JSONObject> completeTasksPool = new ArrayList<JSONObject>();
        for(JSONObject obj : TaskCache.undoTasksPool){
            String taskKey = obj.getString("taskKey");
            if(taskKeys.contains(taskKey)){
                undoTasksPool.add(obj);
            }
        }
        for(JSONObject obj : TaskCache.runningTasksPool){
            String taskKey = obj.getString("taskKey");
            if(taskKeys.contains(taskKey)){
                runningTasksPool.add(obj);
            }
        }
        for(JSONObject obj : TaskCache.completeTasksPool){
            String taskKey = obj.getString("taskKey");
            if(taskKeys.contains(taskKey)){
                completeTasksPool.add(obj);
            }
        }
        TaskCache.undoTasksPool.removeAll(undoTasksPool);
        TaskCache.runningTasksPool.removeAll(runningTasksPool);
        TaskCache.completeTasksPool.removeAll(completeTasksPool);
        return ServerResponse.createBySuccess("清除成功");
    }
    @RequestMapping("/checkCompleteTasks")
    public synchronized Object checkCompleteTasks(@RequestBody List<String> taskKeys, HttpServletRequest request) throws Exception {
        if(CollectionUtils.isEmpty(taskKeys)){
            return ServerResponse.createByErrorMessage("为传入taskKeys");
        }
        if(CollectionUtils.isEmpty(TaskCache.completeTasksPool)){
            return ServerResponse.createByErrorMessage("没有完成的任务");
        }
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        List<JSONObject> finalRes = new ArrayList<JSONObject>();
        List<JSONObject> needRemoveTasks = new ArrayList<JSONObject>();
        synchronized (TaskCache.completeTasksPool){
            for(JSONObject obj:TaskCache.completeTasksPool){
                String taskKey = obj.getString("taskKey");
                boolean res = taskKeys.contains(taskKey);
                String filename=null;
                String objUrl=null;
                if(res) {//抓取最后的结果 返回给前端
                    needRemoveTasks.add(obj);
                    Integer taskTpye = obj.getInteger("taskTpye");
                    String promptId = obj.getString("promptId");
                    if (taskTpye == 1) {
                        String apiKey = obj.getString("apiKey");

                        String rhRes = doPostHistoryRh(apiKey, promptId);
                        JSONObject jsonRhRes = JSONObject.parseObject(rhRes);
                        if (jsonRhRes != null && "SUCCESS".equals(jsonRhRes.getString("status"))) {//运行完成
                            objUrl = jsonRhRes.getJSONArray("results").getJSONObject(0).getString("url");
                            String outputType = jsonRhRes.getJSONArray("results").getJSONObject(0).getString("outputType");
                            filename = promptId + "." + outputType;
                        }
                    } else {
                        String resComfyui = doGet(getComfyuiUrl() + "/history/" + promptId, null);
                        JSONObject resultData = JSONObject.parseObject(resComfyui);
                        JSONObject image = null;
                        try {
                            image = resultData.getJSONObject(promptId).getJSONObject("outputs").getJSONObject("" + obj.getInteger("outputsNum")).getJSONArray("images").getJSONObject(0);
                        } catch (Exception e) {
                            image = resultData.getJSONObject(promptId).getJSONObject("outputs").getJSONObject("" + obj.getInteger("outputsNum")).getJSONArray("gifs").getJSONObject(0);
                        }
                        filename = image.getString("filename");
                        String subfolder = image.getString("subfolder");

                        objUrl = getComfyuiUrl() + "/view?filename=" + filename + "&subfolder=" + subfolder + "&type=output";
                        objUrl = encodeUrl(objUrl);
                    }
                    String objFullName = downloadFileByurl(objUrl, filename);
                    String name = objFullName.split("\\.")[0];
                    objFullName = "http://" + IpCache.ipCache.get("ip") + ":" + new Integer(httpRequest.getLocalPort()).toString() + "/" + objFullName;
                    JSONObject resObj = new JSONObject();
                    resObj.put("item", obj);
                    resObj.put("taskKey", taskKey);
                    resObj.put("objUrl", objFullName);
                    resObj.put("taskIndex", obj.getInteger("taskIndex"));
                    //taskIndex
                    finalRes.add(resObj);
                }
            }
        }
        if(!CollectionUtils.isEmpty(needRemoveTasks) && !CollectionUtils.isEmpty(TaskCache.completeTasksPool)){
            TaskCache.completeTasksPool.removeAll(needRemoveTasks);
        }
        if(CollectionUtils.isEmpty(finalRes)){
            return ServerResponse.createByErrorMessage("没有生成结果");
        }else{
            return ServerResponse.createBySuccess(finalRes);
        }
    }
    public String encodeUrl(String rawUrl) {
        return  rawUrl.replace(" ", "%20");
    }
    /**
     * 每秒执行一次
     * fixedRate：固定速率执行，单位毫秒
     */
    @Scheduled(fixedRate = 2000)
    public void dealWithTasks(){
        try{
            log.info("定时任务开启，轮询任务池");
            List<JSONObject> finishTasks = new ArrayList<>();
            List<JSONObject> newTasks = new ArrayList<>();
            List<JSONObject> needAddedComplete = new ArrayList<>();
            List<JSONObject> needAddedRunning = new ArrayList<>();
            synchronized (TaskCache.runningTasksPool){
                if(!CollectionUtils.isEmpty(TaskCache.runningTasksPool)){
                    for(JSONObject obj : TaskCache.runningTasksPool){
                        Integer taskTpye = obj.getInteger("taskTpye");
                        if(taskTpye == 1){//RH 只要运行中 就可查询，非运行中的项目没有promptId
                            String apiKey = obj.getString("apiKey");
                            String promptId = obj.getString("promptId");
                            String rhRes = doPostHistoryRh(apiKey, promptId);
                            JSONObject jsonRhRes = JSONObject.parseObject(rhRes);
                            if(jsonRhRes!=null && "SUCCESS".equals(jsonRhRes.getString("status")) ){//运行完成
                                //jsonRhRes.getJSONArray("results").getJSONObject(0).getString("url");
                                /*加入完成队列*/
                                obj.put("taskStatus",2);
                                finishTasks.add(obj);
                                needAddedComplete.add(obj);
                            }
                        }else{
                            String comfyuiUrl = getComfyuiUrl();
                            String promptId = obj.getString("promptId");
                            String comfyuiRes = doGet(comfyuiUrl + "/history/" + promptId, null);
                            JSONObject jsonComfyuiRes = JSONObject.parseObject(comfyuiRes);
                            JSONObject nodeData = jsonComfyuiRes.getJSONObject(promptId);
                            //if (nodeData && nodeData.status.status_str === 'success') {
                            if(nodeData!=null && "success".equals(nodeData.getJSONObject("status").getString("status_str")) ){
                                finishTasks.add(obj);
                                obj.put("taskStatus",2);
                                needAddedComplete.add(obj);
                            }
                        }
                    }
                }
            }
            TaskCache.completeTasksPool.addAll(needAddedComplete);
            /*清理队列*/
            if(!CollectionUtils.isEmpty(TaskCache.runningTasksPool) && !CollectionUtils.isEmpty(finishTasks) ){
                TaskCache.runningTasksPool.removeAll(finishTasks);
            }
            synchronized (TaskCache.undoTasksPool){
                if(!CollectionUtils.isEmpty(TaskCache.undoTasksPool)){
                    for(JSONObject obj : TaskCache.undoTasksPool){
                        Integer taskTpye = obj.getInteger("taskTpye");
                        if(taskTpye == 1){//RH
                            String res = doPostJsonRh(obj.getString("workflowId"), obj.getJSONArray("nodeInfoList"),  obj.getString("apiKey"),  obj.getString("instanceType"));
                            /*获得返回结果*/
                            JSONObject resJSON = JSONObject.parseObject(res);
                            /*获取任务ID*/
                            String promptId = resJSON.getString("taskId");
                            if(!StringUtils.isEmpty(promptId)){
                                /*运行中*/
                                obj.put("taskStatus",1);
                                obj.put("promptId",promptId);
                                newTasks.add(obj);
                                needAddedRunning.add(obj);
                            }
                        }else{
                            String comfyuiUrl = getComfyuiUrl();
                            /*获得返回结果*/
                            String res = doPostJson(comfyuiUrl + "/prompt", obj.getString("jsonStr"));
                            JSONObject resJSON = JSONObject.parseObject(res);
                            String promptId = resJSON.getString("prompt_id");
                            if(!StringUtils.isEmpty(promptId)){
                                /*运行中*/
                                obj.put("taskStatus",1);
                                obj.put("promptId",promptId);
                                newTasks.add(obj);
                                needAddedRunning.add(obj);
                            }

                        }
                    }

                }
            }
            TaskCache.runningTasksPool.addAll(needAddedRunning);
            /*清理队列*/
            if(!CollectionUtils.isEmpty( TaskCache.undoTasksPool) && !CollectionUtils.isEmpty(newTasks) ){
                TaskCache.undoTasksPool.removeAll(newTasks);
            }
            log.info("runningTasksPool数量："+TaskCache.runningTasksPool.size());
            log.info("undoTasksPool数量："+TaskCache.undoTasksPool.size());
            log.info("completeTasksPool数量："+TaskCache.completeTasksPool.size());
        }catch (Exception e){
            log.info(e.getMessage());
        }

    }
//    @RequestMapping("/history/{prompt_id}")
//    public Object history(@PathVariable("prompt_id") String prompt_id) throws Exception {
//        log.info("history:" + prompt_id);
//        String comfyuiUrl = getComfyuiUrl();
//        return doGet(comfyuiUrl + "/history/" + prompt_id, null);
//    }

//    @RequestMapping("/historyRH/{prompt_id}/{apiKey}")
//    public Object historyRH(@PathVariable("prompt_id") String prompt_id,@PathVariable("apiKey") String apiKey) throws Exception {
//
//        return  doPostHistoryRh(apiKey, prompt_id);
//    }
    @RequestMapping("/rhprompt")
    public Object rhprompt(@RequestBody String jsonStr) throws Exception {
        log.info("prompt:" + jsonStr);
        JSONObject jsonObject = JSONObject.parseObject(jsonStr);
        JSONArray nodeInfoList = jsonObject.getJSONArray("nodeInfoList");
        String workflowId = jsonObject.getString("workflowId");
        String apiKey = jsonObject.getString("apiKey");
        String instanceType   =configService.selectById(8).getUrl().trim();
        Integer taskIndex = jsonObject.getInteger("taskIndex");
        Integer outputs = jsonObject.getInteger("outputsNum");

        JSONObject reqData = new JSONObject();
        reqData.put("nodeInfoList",nodeInfoList);
        reqData.put("instanceType",instanceType);
        reqData.put("workflowId",workflowId);
        reqData.put("apiKey",apiKey);
        reqData.put("taskIndex",taskIndex);
        reqData.put("taskTpye",1);
        reqData.put("outputsNum",outputs);



        /*发送任务*/
        String res = doPostJsonRh(workflowId, nodeInfoList, apiKey, instanceType);

        /*获得返回结果*/
        JSONObject resJSON = JSONObject.parseObject(res);
        /*获取任务ID*/
        String promptId = resJSON.getString("taskId");

        String taskKey = IdGen.uuid();
        reqData.put("taskKey",taskKey);

        if(StringUtils.isEmpty(promptId)){
            /*未运行*/
            reqData.put("taskStatus",0);
            TaskCache.undoTasksPool.add(reqData);
        }else{
            /*运行中*/
            reqData.put("taskStatus",1);
            reqData.put("promptId",promptId);
            TaskCache.runningTasksPool.add(reqData);
        }

        return ServerResponse.createBySuccess(taskKey) ;
    }
    @RequestMapping("/prompt")
    public Object prompt(@RequestBody String jsonStr) throws Exception {
        log.info("prompt:" + jsonStr);
        JSONObject jsonObject = JSONObject.parseObject(jsonStr);
        Integer taskIndex = jsonObject.getInteger("taskIndex");
        Integer outputsNum = jsonObject.getInteger("outputsNum");
        jsonObject.remove("taskIndex");
        jsonObject.remove("outputsNum");
        jsonStr = jsonObject.toString();
        String comfyuiUrl = getComfyuiUrl();
        /*获得返回结果*/
        String res = doPostJson(comfyuiUrl + "/prompt", jsonStr);
        /*获得返回结果*/
        JSONObject resJSON = JSONObject.parseObject(res);
        JSONObject reqData = new JSONObject();
        reqData.put("taskTpye",0);
        reqData.put("taskIndex",taskIndex);
        reqData.put("outputsNum",outputsNum);
        reqData.put("prompt",jsonStr);
        String taskKey = IdGen.uuid();
        reqData.put("taskKey",taskKey);
        String promptId = resJSON.getString("prompt_id");
        /*获取任务ID*/
        if(StringUtils.isEmpty(promptId)){
            /*未运行*/
            reqData.put("taskStatus",0);
            TaskCache.undoTasksPool.add(reqData);
        }else{
            /*运行中*/
            reqData.put("taskStatus",1);
            reqData.put("promptId",promptId);
            TaskCache.runningTasksPool.add(reqData);
        }

        return ServerResponse.createBySuccess(taskKey) ;
    }
    public String getComfyuiUrl() {
        return IpCache.ipCache.get("comfyuiUrl");
    }


    @RequestMapping("/interrupt")
    public Object interrupt() throws Exception {
        log.info("interrupt~~~~:");
        String comfyuiUrl = getComfyuiUrl();
//        TaskCache.undoTasksPool.clear();
//        TaskCache.runningTasksPool.clear();
//        TaskCache.completeTasksPool.clear();
        return doPostJson(comfyuiUrl + "/interrupt", null);
    }


    @RequestMapping("/upload2RH")
    public Object upload2RH(String name,String apiKey) throws Exception {
        if(StringUtils.isEmpty(name)||StringUtils.isEmpty(apiKey)){
            return ServerResponse.createByErrorMessage("参数为空");
        }
        String fileName= uploadInputFilePath+name;
//        fileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8.name());
        log.info(fileName);
        File file = new File(fileName);
        if(!file.exists()){
            String outPutfileName= uploadOutputFilePath+name;
            file  = new File(outPutfileName);
            if(!file.exists()){
                String resourceName = uploadInputFilePath+"resources/"+name;
                file  = new File(resourceName);
                if(!file.exists()){
                    return ServerResponse.createByErrorMessage("文件不存在");
                }
            }
        }
        long length = file.length();
        if(length > 1024 * 1024*30){
            return ServerResponse.createByErrorMessage("文件大小超过30M");
        }
        return  ServerResponse.createBySuccess(doPostUploadRH(file,apiKey));
    }





    @RequestMapping("/upload/image")
    public Object uploadImage(@RequestParam("image") MultipartFile image) throws Exception {
        log.info("image:" + image.getOriginalFilename());
        return sendFormData(getComfyuiUrl() + "/upload/image", image);
    }

    @RequestMapping("/saveCapcut")
    public ServerResponse<String> saveCapcut(@RequestBody CapCutVo capCut) {
        if (capCut == null || StringUtils.isEmpty(capCut.getName()) || capCut.getDatas() == null) {
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }
        Boolean isSuccess = false;
        try {

            String defualtSaveAddr = configService.selectById(5).getUrl();
            if (StringUtils.isEmpty(defualtSaveAddr)) {
                // 获取文件系统视图（跨平台）
                FileSystemView fileSystemView = FileSystemView.getFileSystemView();
                // 获取桌面目录（Windows 下即为桌面路径）
                File desktopDir = fileSystemView.getHomeDirectory();
                // 转换为字符串路径
                defualtSaveAddr = desktopDir.getAbsolutePath();
            }
            String filesPath = defualtSaveAddr + "\\" + capCut.getName();
            Files.createDirectories(Paths.get(filesPath));
            for (int i=0;i<capCut.getDatas().size();i++) {
                String urlFileExtension = UrlFileExtensionUtil.getUrlFileExtension(capCut.getDatas().get(i));
                copyUrlFileToLocal(capCut.getDatas().get(i),filesPath+"\\"+(i+1)+"."+urlFileExtension);
            }


            isSuccess = true;
        } catch (Exception e) {
            isSuccess = false;
            e.printStackTrace();
        }


        if (isSuccess) {
            return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
        } else {
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }

    }


    @RequestMapping("/saveFirstAndEnds")
    public ServerResponse<String> saveFirtAndEnds(@RequestBody CapCutVo capCut) {
        if (capCut == null || StringUtils.isEmpty(capCut.getName()) || capCut.getDatas() == null) {
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }
        Boolean isSuccess = false;
        try {

            String defualtSaveAddr = configService.selectById(5).getUrl();
            if (StringUtils.isEmpty(defualtSaveAddr)) {
                // 获取文件系统视图（跨平台）
                FileSystemView fileSystemView = FileSystemView.getFileSystemView();
                // 获取桌面目录（Windows 下即为桌面路径）
                File desktopDir = fileSystemView.getHomeDirectory();
                // 转换为字符串路径
                defualtSaveAddr = desktopDir.getAbsolutePath();
            }
            String filesPath = defualtSaveAddr + "\\" + capCut.getName();
            Files.createDirectories(Paths.get(filesPath));
            int fileIndex = 0;
            for (int i=0;i<capCut.getDatas().size();i++) {

                //文件名字
                String fileName = FilenameUtils.getName(capCut.getDatas().get(i));
                FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(uploadOutputFilePath +"/"+ fileName);
                try{
                    grabber.start();
                    long duration = grabber.getLengthInTime();
                    if (duration <= 0) {
                       continue;
                    }
                    Frame frameStart=null;
                    Frame frameEnd=null;
                    log.info("duration:"+duration);

                    if(i == capCut.getDatas().size() -1){
                        frameStart = grabber.grabImage();
                        fileIndex ++;
                        Java2DFrameConverter converter = new Java2DFrameConverter();
                        BufferedImage bufferedImage = converter.convert(frameStart);
                        File targetFile = new File(filesPath+"\\"+fileIndex+".png");
                        ImageIO.write(bufferedImage, "png", targetFile);
                    }else if(i == 0){
                        long seekPos = Math.max(0, duration - 100000);
                        grabber.setTimestamp(seekPos);
                        Frame frame = null;
                        while ((frame = grabber.grabImage()) != null) {
                            if(frame !=null && frame.imageWidth!=0){
                                frameEnd = frame.clone();
                            }
                        }
                        fileIndex ++;
                        Java2DFrameConverter converter = new Java2DFrameConverter();
                        BufferedImage bufferedImage = converter.convert(frameEnd);
                        File targetFile = new File(filesPath+"\\"+fileIndex+".png");
                        ImageIO.write(bufferedImage, "png", targetFile);
                    }else{
                        frameStart = grabber.grabImage();
                        fileIndex ++;
                        Java2DFrameConverter converter1 = new Java2DFrameConverter();
                        BufferedImage bufferedImage1 = converter1.convert(frameStart);
                        File targetFile1 = new File(filesPath+"\\"+fileIndex+".png");
                        ImageIO.write(bufferedImage1, "png", targetFile1);
                        long seekPos = Math.max(0, duration - 100000);
                        grabber.setTimestamp(seekPos);
                        Frame frame=null;
                        while ((frame = grabber.grabImage()) != null) {
                            if(frame !=null && frame.imageWidth!=0){
                                frameEnd = frame.clone();
                            }

                        }
                        fileIndex ++;
                        Java2DFrameConverter converter2 = new Java2DFrameConverter();
                        BufferedImage bufferedImage2 = converter2.convert(frameEnd);
                        File targetFile2 = new File(filesPath+"\\"+fileIndex+".png");
                        ImageIO.write(bufferedImage2, "png", targetFile2);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }finally {
                    grabber.stop();
                }

            }


            isSuccess = true;
        } catch (Exception e) {
            isSuccess = false;
            e.printStackTrace();
        }


        if (isSuccess) {
            return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
        } else {
            return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
        }

    }
    public void copyUrlFileToLocal(String urlStr, String targetPath) throws MalformedURLException, IOException {
        // 1. 创建URL对象，验证URL格式
        URL url = new URL(urlStr);
        // 2. 创建目标文件对象
        File targetFile = new File(targetPath);

        // 3. 自动创建目标文件的父目录（如果不存在）
        File parentDir = targetFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            boolean mkdirsSuccess = parentDir.mkdirs();
            if (!mkdirsSuccess) {
                throw new IOException("创建目标文件父目录失败：" + parentDir.getAbsolutePath());
            }
        }

        // 4. 使用try-with-resources自动关闭流（Java 7+特性）
        // 打开URL连接，获取输入流（带缓冲，提升读取效率）
        URLConnection connection = url.openConnection();
        BufferedInputStream in = new BufferedInputStream(connection.getInputStream());
        // 打开本地文件输出流（带缓冲，提升写入效率）
        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(targetFile));
        // 5. 缓冲区字节数组（8KB，平衡内存占用和效率）
        byte[] buffer = new byte[8192];
        int bytesRead;
        // 循环读取URL流数据，写入本地文件
        while ((bytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
        // 强制刷新输出流，确保所有数据写入文件
        out.flush();
        out.close();
        in.close();
        log.info("文件复制成功！");
        log.info("源URL：" + urlStr);
        log.info("目标路径：" + targetFile.getAbsolutePath());

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

}
