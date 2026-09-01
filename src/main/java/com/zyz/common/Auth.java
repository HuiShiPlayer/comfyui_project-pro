package com.zyz.common;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface Auth {
	String value() default "NeedAuth  Authorization";
	String[] Roles() default {"admin"};
}
