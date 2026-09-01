package com.zyz.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        // 设置连接超时时间（单位：毫秒）
        factory.setConnectTimeout(60000);
        // 设置读取超时时间（单位：毫秒）
        factory.setReadTimeout(60000);
        return builder.requestFactory(() -> factory).build();
    }
}
