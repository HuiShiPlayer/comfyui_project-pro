package com.zyz.config;

import com.baomidou.mybatisplus.entity.GlobalConfiguration;
import com.baomidou.mybatisplus.mapper.ISqlInjector;
import com.baomidou.mybatisplus.mapper.LogicSqlInjector;
import com.baomidou.mybatisplus.plugins.PaginationInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = { "com.zyz.mapper*" })
public class MybatisPlusConfig {

	/**
	 * @Description : mybatis-plus分页插件 ---------------------------------
	 * @Author : Liang.Guangqing
	 * @Date : Create in 2017/9/19 13:59
	 */
	@Bean
	public PaginationInterceptor paginationInterceptor() {
		return new PaginationInterceptor();
	}

	/**
	 * 
	 * 逻辑删除
	 * 
	 */
	@Bean
	public ISqlInjector sqlInjector() {
		return new LogicSqlInjector();
	}

	@Bean
	public GlobalConfiguration globalConfiguration() {
		GlobalConfiguration conf = new GlobalConfiguration(new LogicSqlInjector());
//		conf.setLogicDeleteValue("0");
//		conf.setLogicNotDeleteValue("1");
		conf.setIdType(0);
		return conf;
	}
}