package com.zyz.service;

import com.zyz.pojo.ResourceClass;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2026-08-14
 */
public interface ResourceClassService extends IService<ResourceClass> {
	boolean resotreResourceClass(String id);
}
