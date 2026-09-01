package com.zyz.config;

import com.zyz.common.IpCache;
import com.zyz.pojo.Config;
import com.zyz.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.env.Environment;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.InetAddress;

@Component
public class MyInterceptor implements HandlerInterceptor {
    @Autowired
    ConfigService configService;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 在请求处理之前执行的代码，返回false可以中断请求处理流程
        // 获取本机InetAddress对象
        String ip = IpCache.ipCache.get("ip");

//        InetAddress localHost = InetAddress.getLocalHost();
//        // 返回IP地址字符串
//        String ip =  localHost.getHostAddress();
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        int port = httpRequest.getLocalPort();

        Cookie cookie = new Cookie("ip","http://"+ip+":"+port+"/admin");
        // 设置Cookie属性
        cookie.setMaxAge(60 * 60 * 24); // 24小时有效期


        // 添加到响应
        response.addCookie(cookie);
        return true; // 返回true表示继续执行后续的拦截器和控制器方法。
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // 在请求处理之后，视图渲染之前执行的代码（Controller方法调用之后）
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 在整个请求结束之后执行的代码（视图渲染之后）
    }
}
