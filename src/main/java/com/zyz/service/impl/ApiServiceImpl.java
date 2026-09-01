package com.zyz.service.impl;

import com.zyz.pojo.Api;
import com.zyz.mapper.ApiMapper;
import com.zyz.service.ApiService;
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
public class ApiServiceImpl extends ServiceImpl<ApiMapper, Api> implements ApiService {
	@Autowired
	ApiMapper ApiMapper;
	
	@Override
	public boolean resotreApi(String id) {
		return ApiMapper.resotreApi(id) > 0;
	}
}
