package com.zyz.service;

import com.zyz.pojo.Api;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
public interface ApiService extends IService<Api> {
	boolean resotreApi(String id);
}
