package com.zyz.controller;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zyz.config.SpringBootJarPathUtil;
import com.zyz.pojo.Config;
import com.zyz.pojo.ResourceClass;
import com.zyz.pojo.ResourceLibrary;
import com.zyz.common.ResponseCode;
import com.zyz.common.ServerResponse;
import com.zyz.service.ConfigService;
import com.zyz.service.ResourceClassService;
import com.zyz.util.IdGen;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.zyz.service.ResourceLibraryService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author 7theaven
 * @since 2026-08-13
 */
@RestController
@RequestMapping("/admin/resourceLibrary")
public class ResourceLibraryController {
	@Autowired
	SpringBootJarPathUtil springBootJarPathUtil;
	@Autowired
	ResourceClassService resourceClassService;
	private String uploadInputFilePath ;
	private String audioPath;
	@Value("${isDev}")
	public Integer isDev;
	@Value("${outer.static.resources}")
	public String outerResources;

	@Autowired
	ConfigService configService;

	private String baseRoorPath;
	@PostConstruct
	public void initResourcesPath(){
		if(isDev == 0){
			baseRoorPath = springBootJarPathUtil.getJarDirPath()+"/comfyui_static";
			audioPath = springBootJarPathUtil.getJarDirPath()+"/comfyui_static/input/audioFileDir/";
			uploadInputFilePath =  springBootJarPathUtil.getJarDirPath()+"/comfyui_static/input/resources/";
		}else{
			baseRoorPath = outerResources;
			uploadInputFilePath = outerResources+"/input/resources/";
			audioPath =  outerResources+"/input/audioFileDir/";

		}
	}
	@Autowired
	ResourceLibraryService ResourceLibraryServiceImpl;

	@RequestMapping("/getRule")
	public ServerResponse<Object> getRule() {
		Config config = configService.selectById(9);
		return ServerResponse.createBySuccess(config);
	}
	//getSelfAudioResourcee
	@RequestMapping("/getSelfAudioResourcee")
	public ServerResponse<Object> getSelfAudioResourcee(Integer count,Integer resourceType,String prompt) throws IOException {
		if(count == null || resourceType == null ){
			return ServerResponse.createByErrorMessage("参数错误");
		}

		JSONObject res =new JSONObject();
		JSONArray arr =new JSONArray();
		res.put("resources",arr);

		if(StringUtils.isEmpty(prompt)){
			res.put("prompt",null);
			return ServerResponse.createByErrorMessage("无关键词");
		}
		String rule = configService.selectById(9).getUrl();
		Pattern pattern = Pattern.compile(rule);
		Matcher matcher = pattern.matcher(prompt);
		int num =0;
		while (matcher.find()) {
			String content = matcher.group(1).trim();
			File dir = new File(audioPath);
			if(!dir.exists() || !dir.isDirectory()){
				return ServerResponse.createByErrorMessage("系统错误");
			}
			File[] files = dir.listFiles();
			if(files == null){
				return ServerResponse.createByErrorMessage("音频目录为空");
			}
			for(File file : files){
				if(file.getName().toLowerCase().contains(content.toLowerCase())){
					num ++;
					String fileExtensionWithDot = getFileExtensionWithDot(file.getName());
					String newFileName = IdGen.uuid()+fileExtensionWithDot;
					Files.copy(
							Paths.get(baseRoorPath+"/input/audioFileDir/"+file.getName()),
							Paths.get(baseRoorPath+"/input/"+newFileName),
							StandardCopyOption.REPLACE_EXISTING
					);
					arr.add("input/"+newFileName);
					break;
				}
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
	@RequestMapping("/getGlobalResource")
	public ServerResponse<Object> getGlobalResource(Integer count,Integer resourceType,String prompt) throws IOException {
		if(count == null || resourceType == null ){
			return ServerResponse.createByErrorMessage("参数错误");
		}

		JSONObject res =new JSONObject();
		JSONArray arr =new JSONArray();
		res.put("resources",arr);

		if(StringUtils.isEmpty(prompt)){
			res.put("prompt",null);
			return ServerResponse.createByErrorMessage("无关键词");
		}
		String rule = configService.selectById(9).getUrl();
		Pattern pattern = Pattern.compile(rule);
		Matcher matcher = pattern.matcher(prompt);
		int num =0;
		while (matcher.find()) {
			String content = matcher.group(1).trim();;
			if(resourceType == 1){
				/*图片*/
				ResourceLibrary resourceLibrary = ResourceLibraryServiceImpl.selectOne(new EntityWrapper<ResourceLibrary>().like("name", content).orderBy("create_time", false));
				if(resourceLibrary!=null){
					num ++;

					Files.copy(
							Paths.get(baseRoorPath+resourceLibrary.getLocalUrl()),
							Paths.get(baseRoorPath+"/input/"+resourceLibrary.getLocalName()),
							StandardCopyOption.REPLACE_EXISTING
					);
					arr.add("input/"+resourceLibrary.getLocalName());
				}
			}else if(resourceType == 2){
				File dir = new File(audioPath);
				if(!dir.exists() || !dir.isDirectory()){
					return ServerResponse.createByErrorMessage("系统错误");
				}
				File[] files = dir.listFiles();
				if(files == null){
					return ServerResponse.createByErrorMessage("音频目录为空");
				}
				for(File file : files){
					if(file.getName().toLowerCase().contains(content.toLowerCase())){
						num ++;
						String fileExtensionWithDot = getFileExtensionWithDot(file.getName());
						String newFileName = IdGen.uuid()+fileExtensionWithDot;
						Files.copy(
								Paths.get(baseRoorPath+"/input/audioFileDir/"+file.getName()),
								Paths.get(baseRoorPath+"/input/"+newFileName),
								StandardCopyOption.REPLACE_EXISTING
						);
						arr.add("input/"+newFileName);
						break;
					}
				}
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

	//asyncResources
	@RequestMapping("/asyncResources")
	public ServerResponse<Object> asyncResources(Integer count,Integer resourceType,String prompt,Integer index) throws IOException {
		if(count == null || resourceType == null  || index ==null){
			return ServerResponse.createByErrorMessage("参数错误");
		}

		JSONObject res =new JSONObject();
		JSONArray arr =new JSONArray();
		res.put("index",index);

		res.put("resources",arr);

		if(StringUtils.isEmpty(prompt)){
			res.put("prompt",null);
			return ServerResponse.createBySuccess(res);
		}

		String rule = configService.selectById(9).getUrl();
		res.put("prompt",prompt.replaceAll(rule, "$1"));
		Pattern pattern = Pattern.compile(rule);
		Matcher matcher = pattern.matcher(prompt);
		int num =0;
		while (matcher.find()) {
			String content = matcher.group(1).trim();
			if(resourceType == 1){
				/*图片*/
				ResourceLibrary resourceLibrary = ResourceLibraryServiceImpl.selectOne(new EntityWrapper<ResourceLibrary>().like("name", content).orderBy("create_time", false));
				if(resourceLibrary!=null){
					num ++;
					Files.copy(
							Paths.get(baseRoorPath+resourceLibrary.getLocalUrl()),
							Paths.get(baseRoorPath+"/input/"+resourceLibrary.getLocalName()),
							StandardCopyOption.REPLACE_EXISTING
					);
					arr.add("input/"+resourceLibrary.getLocalName());
				}
			}else if(resourceType == 2){

			}
			if(num>= count){
				break;
			}
		}

		return ServerResponse.createBySuccess(res);

	}
	@RequestMapping("/upload")
	public ServerResponse<Object> handleFileUpload(@RequestParam("file") MultipartFile file) {
		if (file.isEmpty()) {
			return ServerResponse.createByErrorMessage("请添加上传文件");
		}
		try {
			// 获取文件名
			String fileName = IdGen.uuid()+"-"+file.getOriginalFilename();
			// 设置文件存储路径（这里以当前项目路径下的uploads目录为例）
			Path path = Paths.get(uploadInputFilePath + fileName);
			// 写入文件到服务器指定位置
			Files.write(path, file.getBytes());

			ResourceLibrary resource =new ResourceLibrary();
			resource.setCreateTime(new Date());
			resource.setLocalName(fileName);
			resource.setLocalUrl("/input/resources/"+fileName);
			ResourceLibraryServiceImpl.insert(resource);
			return ServerResponse.createBySuccess("input/resources/"+fileName);
		} catch (IOException e) {
			e.printStackTrace();
			return ServerResponse.createByErrorMessage("上传失败");
		}
	}

	@RequestMapping("/getAllResources")
	public ServerResponse<Page<ResourceLibrary>> getApiByPage(@RequestParam(defaultValue = "1", name = "pageNum") Integer pageNum,
												  				@RequestParam(defaultValue = "20", name = "pageSize") Integer pageSize,
												  				@RequestParam(name = "name", required = false) String name,
												  				@RequestParam(name = "type", required = false) Integer type,
															  	@RequestParam(name = "classId", required = false) Integer classId,
															 	@RequestParam(name = "className", required = false) String className,
												 				@RequestParam(name = "classType", required = false) Integer classType) {
		Page<ResourceLibrary> page = new Page<ResourceLibrary>(pageNum, pageSize);
		EntityWrapper<ResourceLibrary> ew = new EntityWrapper<ResourceLibrary>();
		if (!StringUtils.isEmpty(name)) {
			ew.like("name", name);
		}
		if (type != null && type != -1) {
			ew.eq("type", type);
		}
		if (classType != null && classType != -1) {
			ew.eq("class_type", classType);
		}
		if (classId != null && classId != -1) {
			ew.eq("class_id", classId);
		}
		ew.orderBy("create_time", false);
		Page<ResourceLibrary> selectPage = ResourceLibraryServiceImpl.selectPage(page, ew);
		if (selectPage.getRecords().size() != 0)
			return ServerResponse.createBySuccess(selectPage);
		else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());

	}

	@RequestMapping("/getCount")
	public Object getCount() {
		int i = ResourceLibraryServiceImpl.selectCount(null);
		return ServerResponse.createBySuccess(i);
	}
	@RequestMapping("/getAllClass")
	public Object getAllClass() {
		List<ResourceClass> resourceClasses = resourceClassService.selectList(new EntityWrapper<ResourceClass>().orderBy("create_time",false));
		return ServerResponse.createBySuccess(resourceClasses);
	}
	

	@PostMapping("/deleteLocalDataFile")
	public Object deleteLocalDataFile(ResourceLibrary info) {
		if (info != null && info.getId() != null) {
			File file = new File(uploadInputFilePath + info.getLocalName());
			if(!file.exists()){
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
			}
			boolean delete = file.delete();
			if(delete){
				boolean res = ResourceLibraryServiceImpl.deleteById(info);
				if(!res){
					return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
				}else{
					return  ServerResponse.createBySuccess();
				}
			}else{
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
			}
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	///updateClass
	@PostMapping("/updateClass")
	public Object updateClass(ResourceLibrary info) {
		if (info != null && info.getId() != null) {
			if(info.getId() ==null || StringUtils.isEmpty(info.getName())){
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
			}
			ResourceLibrary item =new ResourceLibrary();
			item.setId(info.getId());
			item.setClassId(info.getClassId());
			item.setClassName(info.getClassName());
			boolean b = ResourceLibraryServiceImpl.updateById(item);
			if (b)
				return ServerResponse.createBySuccess(ResponseCode.SUCCESS.getDesc());
			else
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
		} else
			return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
	}
	@PostMapping("/editName")
	public Object updatePrompt(ResourceLibrary info) {
		if (info != null && info.getId() != null) {
			if(info.getId() ==null || StringUtils.isEmpty(info.getName())){
				return ServerResponse.createByErrorMessage(ResponseCode.ERROR.getDesc());
			}
			ResourceLibrary item =new ResourceLibrary();
			item.setId(info.getId());
			item.setName(info.getName());
			boolean b = ResourceLibraryServiceImpl.updateById(item);
			if (b)
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
	@GetMapping("/download")
	public void downloadLocalImage(Integer id,HttpServletResponse response) throws IOException {
		if(id == null){
			return;
		}
		ResourceLibrary resourceLibrary = ResourceLibraryServiceImpl.selectById(id);
		if(resourceLibrary == null){
			return;
		}
		String filePath= uploadInputFilePath +resourceLibrary.getLocalName();
		File file = new File(filePath);
		if (!file.exists() || !file.isFile()) {
			response.setStatus(404);
			return;
		}

		String fileName = resourceLibrary.getLocalName();

		// 中文文件名编码
		fileName = URLEncoder.encode(fileName, "UTF-8");

		// 设置下载响应头
		response.setContentType("application/octet-stream");
		response.setHeader("Content-Disposition",
				"attachment; filename=\"" + fileName + "\"; filename*=UTF-8''" + fileName);


		try (FileInputStream fis = new FileInputStream(file);
			 OutputStream os = response.getOutputStream()) {

			byte[] buffer = new byte[4096];
			int len;
			while ((len = fis.read(buffer)) != -1) {
				os.write(buffer, 0, len);
			}
			os.flush();
		}
	}
	public String getFileExtensionWithDot(String fileName) {
		if (fileName == null || StringUtils.isEmpty(fileName)) return "";
		int dotPos = fileName.lastIndexOf('.');
		if (dotPos <= 0 || dotPos == fileName.length() - 1) {
			return "";
		}
		return fileName.substring(dotPos);
	}


}

