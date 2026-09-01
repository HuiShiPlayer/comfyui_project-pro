package com.zyz.config;

import com.zyz.App;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Log
/*禁用请求缓存*/
@Configuration
public class WebConfig implements WebMvcConfigurer   {

    @Value("${isDev}")
    public Integer isDev;
    @Value("${outer.static.resources}")
    public String outerResources;

    @Autowired
    SpringBootJarPathUtil springBootJarPathUtil;

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(new HandlerInterceptor() {
//            @Override
//            public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
//                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//                response.setHeader("Pragma", "no-cache");
//                response.setDateHeader("Expires", 0);
//            }
//        });
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String externalResourcePath = null;

        if(isDev != 1){
            externalResourcePath = "file:"+springBootJarPathUtil.getJarDirPath()+"/comfyui_static/";

        }else{
            externalResourcePath = "file:"+outerResources+"/"; // Windows系统
        }
        log.info("isDev:"+isDev);
        log.info("externalResourcePath:"+externalResourcePath);

        registry.addResourceHandler("/**") // 所有静态资源请求
                .addResourceLocations(
                        externalResourcePath, // 外部磁盘路径（优先级最高）
                        "classpath:/META-INF/resources/",
                        "classpath:/resources/",
                        "classpath:/public/", //
                        "classpath:/static/" // 项目内默认路径
                );
    }
}

