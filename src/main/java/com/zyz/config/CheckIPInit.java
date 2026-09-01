package com.zyz.config;

import com.zyz.common.IpCache;
import com.zyz.pojo.Config;
import com.zyz.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class CheckIPInit {
    @Autowired
    ConfigService configService;
    @PostConstruct
    public void checkProjectIP() throws UnknownHostException {

        Config config = configService.selectById(4);
        String ip = config.getUrl();
        String comfyuiUrl = configService.selectById(2).getUrl();
        IpCache.ipCache.put("comfyuiUrl",comfyuiUrl);
//        InetAddress localHost = InetAddress.getLocalHost();
//        // 返回IP地址字符串
//        String ip =  localHost.getHostAddress();

        configService.updateAllIPData(ip);
    }
}
