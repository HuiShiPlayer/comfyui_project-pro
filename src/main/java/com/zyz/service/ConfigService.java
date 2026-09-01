package com.zyz.service;

import com.zyz.pojo.Config;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
public interface ConfigService extends IService<Config> {
	boolean resotreConfig(String id);
	void updateAllIPData(String ip);
}
