package com.zyz.util;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HttpPostWithJSON {
	private static Logger log = LoggerFactory.getLogger(HttpPostWithJSON.class);

	public static String httpPostWithJSON(String url, String jsonParams) throws Exception {

		HttpPost httpPost = new HttpPost(url);
		CloseableHttpClient client = HttpClients.createDefault();
		String respContent = null;
		StringEntity entity = new StringEntity(jsonParams, "utf-8");// 解决中文乱码问题
		entity.setContentEncoding("UTF-8");
		entity.setContentType("application/json");
		httpPost.setEntity(entity);

		// 表单方式
		// List<BasicNameValuePair> pairList = new
		// ArrayList<BasicNameValuePair>();
		// pairList.add(new BasicNameValuePair("name", "admin"));
		// pairList.add(new BasicNameValuePair("pass", "123456"));
		// httpPost.setEntity(new UrlEncodedFormEntity(pairList, "utf-8"));

		CloseableHttpResponse resp = client.execute(httpPost);
		if (resp.getStatusLine().getStatusCode() == 200) {
			HttpEntity he = resp.getEntity();
			respContent = EntityUtils.toString(he, "UTF-8");
		}
		log.info(respContent);
		return respContent;
	}
}
