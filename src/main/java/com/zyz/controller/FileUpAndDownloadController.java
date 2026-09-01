package com.zyz.controller;
import com.zyz.config.SpringBootJarPathUtil;
import com.zyz.vo.LocalFiles;
import lombok.extern.java.Log;
import org.bytedeco.javacv.*;
import org.bytedeco.javacv.Frame;
import org.bytedeco.javacv.Java2DFrameConverter;

import java.awt.Desktop;
import java.awt.image.BufferedImage;



import com.zyz.common.ServerResponse;
import com.zyz.util.IdGen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.net.*;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/admin")
@Log
public class FileUpAndDownloadController {

    @Autowired
    SpringBootJarPathUtil springBootJarPathUtil;

    private String dataDir="dataFileDir";
    private String soudDir="audioFileDir";



    @Value("${isDev}")
    public Integer isDev;
    @Value("${outer.static.resources}")
    public String outerResources;

    private String uploadInputFilePath ;


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


    @PostMapping("/getLastVideoImage") // 与表单的action属性匹配
    public ServerResponse<Object> getLastImage(String name) throws FFmpegFrameGrabber.Exception {
        String videoPath =uploadOutputFilePath + name;
        log.info("videoPath："+videoPath);
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(videoPath);
        try {
            grabber.start();
            int frameCount = grabber.getLengthInFrames(); // 获取总帧数
            int lastFrameIndex = frameCount - 1; // 获取最后一帧的索引
            grabber.setFrameNumber(lastFrameIndex); // 设置到最后一帧
            Frame f = grabber.grab();
            Java2DFrameConverter converter = new Java2DFrameConverter();
            BufferedImage image = converter.getBufferedImage(f);
            // 保存或处理图像...
            String filename= "last_frame_"+name.substring(0,name.length()-4)+".png";
            String lastImageName =uploadInputFilePath+filename;
            File output = new File(lastImageName);
            ImageIO.write(image, "png", output);
            return ServerResponse.createBySuccess("input/"+filename);
        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("获取失败");
        } finally {
            grabber.stop();
        }
    }

    @PostMapping("/upload") // 与表单的action属性匹配
    public ServerResponse<Object> handleFileUpload(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ServerResponse.createByErrorMessage("请添加上传文件");
        }
        try {
            // 获取文件名
            String suffix = "";
            int lastDotIndex = file.getOriginalFilename().lastIndexOf(".");
            if(lastDotIndex != -1){
                suffix = file.getOriginalFilename().substring(lastDotIndex); // .jpg
                // 不要点：suffix = fileName.substring(lastDotIndex + 1); // jpg
            }
            String fileName = IdGen.uuid()+suffix;


            // 设置文件存储路径（这里以当前项目路径下的uploads目录为例）
            Path path = Paths.get(uploadInputFilePath + fileName);
            // 写入文件到服务器指定位置
            Files.write(path, file.getBytes());
            return ServerResponse.createBySuccess("input/"+fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("上传失败");
        }
    }
    @RequestMapping("/deleteLocalDataFile")
    public ServerResponse<Object> deleteLocalDataFile(LocalFiles file) {
        if(file == null || StringUtils.isEmpty(file.getName())){
            return ServerResponse.createByErrorMessage("请指定文件");
        }
        try{
            Path directory =null;
            if(file.getIsAudio() == 0){
                directory = Paths.get(uploadInputFilePath+dataDir);
            }else{
                directory = Paths.get(uploadInputFilePath+soudDir);
            }

            // 判断文件夹是否存在
            if (!Files.exists(directory)) {
                return ServerResponse.createByErrorMessage("文件不存在");
            }
            Path localfile =null;
            if(file.getIsAudio() == 0){
                localfile  = Paths.get(uploadInputFilePath+dataDir +"/"+ file.getName());
            }else{
                localfile  = Paths.get(uploadInputFilePath+soudDir +"/"+ file.getName());
            }

            if(!Files.exists(localfile)){
                return ServerResponse.createByErrorMessage("文件不存在");
            }else{
                Files.delete(localfile);
            }
            return ServerResponse.createBySuccess("删除成功");
        }catch (Exception e){
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("删除失败");
        }

    }


    @GetMapping("/getTotalCount") // 与表单的action属性匹配
    public ServerResponse<Object> getTotalCount(String name) throws FFmpegFrameGrabber.Exception {

        if (StringUtils.isEmpty(name)) {
            return ServerResponse.createByErrorMessage("参数错误");
        }
        // 获取文件名
        Path localFile = Paths.get(uploadInputFilePath+dataDir +"/"+ name);
        if (!Files.exists(localFile)) {
            return ServerResponse.createByErrorMessage("没有这个文件");
        }
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(uploadInputFilePath+dataDir +"/"+ name);
        try {
            grabber.start();
            int totalFrames = grabber.getLengthInFrames();

            return ServerResponse.createBySuccess(totalFrames);
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("上传失败");
        }finally {
            grabber.stop();
        }
    }




    @RequestMapping(value = "/getFrame/{type}/{count}/{name}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE, consumes = "*/*")
    public ResponseEntity<Resource> getFrame(@PathVariable("type") Integer type,@PathVariable("count") Integer count,@PathVariable("name")String name) throws IOException {
        if (type==null  || StringUtils.isEmpty(name)) {
            return ResponseEntity.status(401).build();
        }

        Path localFile = Paths.get(uploadInputFilePath+dataDir +"/"+ name);
        if (!Files.exists(localFile)) {
            return ResponseEntity.status(402).build();
        }
        FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(uploadInputFilePath+dataDir +"/"+ name);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try{
            grabber.start();
            long duration = grabber.getLengthInTime();
            if (duration <= 0) {
                return ResponseEntity.status(402).build();
            }
            Frame frame=null;
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/octet-stream");
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            headers.add("Content-Transfer-Encoding", "Binary");
            // 初始化视频捕获

            // 获取视频信息
            int totalFrames = grabber.getLengthInFrames();
            double frameRate = grabber.getFrameRate();
            log.info("totalFrames:"+totalFrames);
            log.info("frameRate:"+frameRate);
            String fileName =null;
            if(type == 1){
                frame = grabber.grabImage();
                fileName = "startFrame_" + name.substring(0,name.length()-4)+".png";
                headers.add("Content-Disposition", "attachment;filename=" +fileName);
            }else if(type == 2){
                long seekPos = Math.max(0, duration - 100000);
                grabber.setTimestamp(seekPos);
                Frame frameTemp = null;
                while ((frameTemp = grabber.grabImage()) != null) {
                    if(frameTemp !=null && frameTemp.imageWidth!=0){
                        frame = frameTemp.clone();
                    }
                }
                fileName = "endFrame_" + name.substring(0,name.length()-4)+".png";
                headers.add("Content-Disposition", "attachment;filename=" + fileName);
            }else if(type == 4){
                if(count == 0){
                    return ResponseEntity.status(403).build();
                }
                if (totalFrames > 1 && count <= totalFrames) {
                    // 取第 count 帧
                    grabber.setFrameNumber(count-1);
                    frame = grabber.grabImage();
                }else{
                    return ResponseEntity.status(410).build();
                }
                fileName = count+"_Frame_" + name.substring(0,name.length()-4)+".png";
                headers.add("Content-Disposition", "attachment;filename="+fileName);
            }

            Java2DFrameConverter converter = new Java2DFrameConverter();
            BufferedImage bufferedImage = converter.convert(frame);

            ImageIO.write(bufferedImage, "png", baos);
            baos.flush();
            byte[] imageBytes = baos.toByteArray();

            ByteArrayResource resource = new ByteArrayResource(imageBytes);
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);


        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }finally {
            grabber.stop();
            baos.close();
        }


    }
    private byte[] convertBuffersToByteArray(ByteBuffer[] buffers) {
        int totalLength = 0;
        for (ByteBuffer buffer : buffers) {
            totalLength += buffer.remaining();
        }

        byte[] result = new byte[totalLength];
        int offset = 0;
        for (ByteBuffer buffer : buffers) {
            int length = buffer.remaining();
            buffer.get(result, offset, length);
            offset += length;
        }

        return result;
    }

    @PostMapping("/uploadDataFile") // 与表单的action属性匹配
    public ServerResponse<Object> uploadDataFile(@RequestParam("file") MultipartFile file,@RequestParam(value = "isAudio",defaultValue = "0") Integer isAudio) {

        if (file.isEmpty()) {
            return ServerResponse.createByErrorMessage("请添加上传文件");
        }
        try {
            Path directory = null;
            if(isAudio == 0){
                directory  = Paths.get(uploadInputFilePath+dataDir);
            }else{
                directory  = Paths.get(uploadInputFilePath+soudDir);
            }

            // 判断文件夹是否存在
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }
            // 获取文件名
            String fileName = file.getOriginalFilename();
            Path localfile =null;
            if(isAudio == 0){
                localfile  = Paths.get(uploadInputFilePath+dataDir +"/"+ fileName);
            }else{
                localfile  = Paths.get(uploadInputFilePath+soudDir +"/"+ fileName);
            }

            if(Files.exists(localfile)){
                return ServerResponse.createByErrorMessage("文件名已经存在");
            }
            // 设置文件存储路径（这里以当前项目路径下的uploads目录为例）
            Path path =null;
            if(isAudio == 0){
                path = Paths.get(uploadInputFilePath+dataDir +"/"+ fileName);
            }else{
                path = Paths.get(uploadInputFilePath+soudDir +"/"+ fileName);
            }

            // 写入文件到服务器指定位置
            Files.write(path, file.getBytes());
            return ServerResponse.createBySuccess("input/"+fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("上传失败");
        }
    }

    @RequestMapping("/getAllLocalFile")
    public ServerResponse<List<LocalFiles>> getGenerateRecords(@RequestParam(required = false, name = "name") String name,@RequestParam(value = "isAudio",defaultValue = "0") Integer isAudio) {
        Path directoryPath =null;
        if(isAudio == 0){
            directoryPath = Paths.get(uploadInputFilePath+dataDir);
        }else{
            directoryPath = Paths.get(uploadInputFilePath+soudDir);
        }

        if (!Files.exists(directoryPath)) {
            return ServerResponse.createByErrorMessage("未上传文件");
        }
        try (Stream<Path> walk = Files.walk(directoryPath, 1)) { // 1表示只遍历当前目录，不递归子目录，可根据需要调整参数
            Stream<Path> pathStream = walk.filter(Files::isRegularFile);
            if(!StringUtils.isEmpty(name)){
                pathStream = pathStream.filter(path-> path.getFileName().toString().toLowerCase().indexOf(name) !=-1);
            }
            if(isAudio == 0){
                pathStream = pathStream.filter(path-> isVideoFile(path));
            }else{
                pathStream = pathStream.filter(path-> isAudioFile(path));
            }

            // 过滤出文件
            List<LocalFiles> res = pathStream.map(path -> {
                LocalFiles file = new LocalFiles();
//                FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(path.toFile());
//                try {
//                    grabber.start();
//                    int width = grabber.getImageWidth();
//                    int height = grabber.getImageHeight();
//                    double frameRate = grabber.getFrameRate();
//                    int frameCount = grabber.getLengthInFrames();
//                    grabber.stop();
//                    file.setWidth(width);
//                    file.setHeight(height);
//                    file.setFrameRate(frameRate);
//                    file.setFrames(frameCount);
//                } catch (FFmpegFrameGrabber.Exception e) {
//                    e.printStackTrace();
//                }
                if(isAudio == 0){
                    file.setUrl("input/" + dataDir + "/" + path.getFileName().toString());
                }else{
                    file.setUrl("input/" + soudDir + "/" + path.getFileName().toString());
                }

                file.setName(path.getFileName().toString());
                return file;
            }).collect(Collectors.toList());

            if(CollectionUtils.isEmpty(res)){
                return ServerResponse.createByErrorMessage("未查询到文件");
            }else{
                return ServerResponse.createBySuccess(res);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("系统问题");
        }


    }
    private static boolean isAudioFile(Path path) {
        // 定义常见的视频文件扩展名，与上面方法相同
        String[] videoExtensions = {"mp3", "wav", "flac", "aac", "m4a", "ogg", "wma", "ape"};
        String fileName = path.getFileName().toString().toLowerCase();
        for (String ext : videoExtensions) {
            if (fileName.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
    private static boolean isVideoFile(Path path) {
        // 定义常见的视频文件扩展名，与上面方法相同
        String[] videoExtensions = {".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv"};
        String fileName = path.getFileName().toString().toLowerCase();
        for (String ext : videoExtensions) {
            if (fileName.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
    @RequestMapping("/downloadFileByurl")
    public ServerResponse<Object> downloadFileByurl(@RequestBody Map<String,String> data) throws Exception {
        String fileUrl = data.get("fileUrl");
        fileUrl = encodeUrl(fileUrl);
        log.info(fileUrl);
        String fileName = data.get("fileName");
        if(StringUtils.isEmpty(fileUrl)){
            return ServerResponse.createByErrorMessage("请添加上传文件");
        }
        if(StringUtils.isEmpty(fileName)){
            return ServerResponse.createByErrorMessage("请添加文件名称");
        }
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
            return ServerResponse.createBySuccess("output/"+fileName);
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByErrorMessage("上传失败");
        }
    }
    public static String encodeUrl(String rawUrl) {
        return rawUrl.replace(" ", "%20");
    }

}

