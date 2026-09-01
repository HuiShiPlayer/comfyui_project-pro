package com.zyz.service.impl;

import com.zyz.pojo.ResourceClass;
import com.zyz.mapper.ResourceClassMapper;
import com.zyz.service.ResourceClassService;
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
 * @since 2026-08-14
 */
@Service
@Transactional
public class ResourceClassServiceImpl extends ServiceImpl<ResourceClassMapper, ResourceClass> implements ResourceClassService {
	@Autowired
	ResourceClassMapper ResourceClassMapper;
	
	@Override
	public boolean resotreResourceClass(String id) {
		return ResourceClassMapper.resotreResourceClass(id) > 0;
	}
}
