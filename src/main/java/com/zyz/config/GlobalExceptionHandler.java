package com.zyz.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@ExceptionHandler(value = Exception.class)
    Object handleException(Exception e, HttpServletRequest request) {
		e.printStackTrace();
		logger.error("url {}, msg {}", request.getRequestURL(), e.getMessage());
		Map<String, Object> map = new HashMap<>();
		map.put("code", 500);
		map.put("msg", "服务器繁忙!");
		return map;
	}
//	@GetMapping(path = "/**")
//	public void addResponseHeader(HttpServletResponse response) {
//		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//		response.setHeader("Pragma", "no-cache");
//		response.setDateHeader("Expires", 0);
//	}

}
