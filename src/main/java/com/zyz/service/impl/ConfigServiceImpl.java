package com.zyz.service.impl;

import com.zyz.common.IpCache;
import com.zyz.pojo.Config;
import com.zyz.mapper.ConfigMapper;
import com.zyz.service.ConfigService;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
@Service
@Transactional
public class ConfigServiceImpl extends ServiceImpl<ConfigMapper, Config> implements ConfigService {
	@Autowired
	ConfigMapper ConfigMapper;
	public void updateAllIPData(String ip){
		IpCache.ipCache.put("ip",ip);
		ConfigMapper.updateAllIPData(ip);
	}
	@Override
	public boolean resotreConfig(String id) {
		return ConfigMapper.resotreConfig(id) > 0;
	}
}
