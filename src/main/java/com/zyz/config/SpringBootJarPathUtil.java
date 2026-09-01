package com.zyz.config;

import com.zyz.App;
import org.springframework.boot.system.ApplicationHome;
import org.springframework.stereotype.Component;
import java.io.File;
import java.nio.file.Paths;

/**
 * Spring Boot Jar包路径工具类
 * 精准获取Jar所在目录，适配Jar运行/IDE开发环境
 */
@Component
public class SpringBootJarPathUtil {

    // 替换为你项目的主启动类（带@SpringBootApplication注解的类）
    private static final Class<?> MAIN_CLASS = App.class;

    /**
     * 获取Jar包所在目录的File对象（推荐，方便后续文件/目录操作）
     * @return Jar所在目录File，路径已标准化
     */
    public File getJarDirFile() {
        ApplicationHome appHome = new ApplicationHome(MAIN_CLASS);
        File jarDir = appHome.getDir();
        // 标准化路径（处理跨平台分隔符、多余斜杠，避免路径异常）
        return Paths.get(jarDir.getAbsolutePath()).toFile();
    }

    /**
     * 简化获取：Jar包所在目录的字符串路径（结尾无文件分隔符）
     * @return 标准化路径，例：Windows(D:/deploy/boot-app)、Linux(/usr/local/boot-app)
     */
    public String getJarDirPath() {
        return getJarDirFile().getAbsolutePath();
    }
}