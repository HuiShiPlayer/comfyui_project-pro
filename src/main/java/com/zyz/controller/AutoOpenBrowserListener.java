package com.zyz.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import java.awt.*;
import java.net.URI;
import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * SpringBoot启动完成后自动获取IP+端口并打开浏览器的监听器
 */
@Configuration // 交给Spring容器管理，自动生效
public class AutoOpenBrowserListener implements ApplicationListener<ApplicationReadyEvent> {

    @Value("${auto-open}")
    private Integer autoOpen;
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if(autoOpen == 1){
            try {
                // 1. 获取Web服务器上下文，提取服务端口（适配所有内置Web服务器）
                WebServerApplicationContext webServerContext = (WebServerApplicationContext) event.getApplicationContext();
                int serverPort = webServerContext.getWebServer().getPort();

                // 2. 获取本机实际IP地址（排除127.0.0.1，适配多网卡环境）
                //String localIp = InetAddress.getLocalHost().getHostAddress();

                // 3. 拼接访问地址（默认根路径/，可根据需求修改为具体接口，如/api/index）
                String visitUrl = String.format("http://%s:%d/", "127.0.0.1", serverPort);


                // 4. 自动打开系统默认浏览器
                openBrowser(visitUrl);

            } catch (Exception e) {

                e.printStackTrace();
            }
        }
    }

    /**
     * 兼容跨平台的浏览器打开方法（Windows/Mac/Linux）
     * @param url 访问地址
     * @throws Exception 异常
     */
    private void openBrowser(String url) throws Exception {
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            // 主流系统优先使用Java AWT原生方法（推荐）
            Desktop.getDesktop().browse(new URI(url));
        } else {
            // 兼容Linux等不支持AWT的系统，调用命令行打开
            String os = System.getProperty("os.name").toLowerCase();
            Runtime runtime = Runtime.getRuntime();
            if (os.contains("win")) {
                runtime.exec("cmd /c start " + url);
            } else if (os.contains("mac")) {
                runtime.exec("open " + url);
            } else if (os.contains("nix") || os.contains("nux")) {
                runtime.exec("xdg-open " + url);
            } else {
                throw new RuntimeException("当前系统不支持自动打开浏览器，请手动访问：" + url);
            }
        }
    }
}