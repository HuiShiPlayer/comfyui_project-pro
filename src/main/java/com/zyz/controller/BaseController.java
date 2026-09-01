package com.zyz.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.zyz.common.ApiSource;
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
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Map;

public class BaseController {

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

    public String sendFormData(String targetUrl, MultipartFile file) throws IOException {
        // 1. 创建HttpClient客户端
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            // 2. 构建POST请求
            HttpPost httpPost = new HttpPost(targetUrl);

            // 3. 构建multipart/form-data请求体（MultipartEntityBuilder正常使用）
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            // 3.1 添加文件
            if (file != null && !file.isEmpty()) {
                ByteArrayBody fileBody = new ByteArrayBody(file.getBytes(),
                        ContentType.parse(file.getContentType()),
                        file.getOriginalFilename());
                builder.addPart("image", fileBody);
            }


            // 4. 设置请求体
            HttpEntity entity = builder.build();
            httpPost.setEntity(entity);

            // 5. 执行请求
            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                if (response.getStatusLine().getStatusCode() != 200) {
                    throw new ClientProtocolException("请求失败，状态码：" + response.getStatusLine().getStatusCode());
                }
                HttpEntity responseEntity = response.getEntity();
                return EntityUtils.toString(responseEntity, StandardCharsets.UTF_8);
            } finally {
                EntityUtils.consume(entity);
                httpPost.releaseConnection();
            }
        }
    }

}
