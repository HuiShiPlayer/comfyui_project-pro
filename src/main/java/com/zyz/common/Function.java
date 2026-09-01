package com.zyz.common;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
/**
 * 排序编号
 * 一级菜单 排序 间隔1000
 * 二级菜单排序  间隔 5
 * 三级功能菜单  排序 加100 后间隔10
 */
public @interface Function {
	String id() default "";
	String name() default "";
	String secondId() default "";
	String url() default "";
	int sortNum() default 0;
	int level() default 2;
}
