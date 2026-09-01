package com.zyz.service.impl;

import com.zyz.pojo.ResourceLibrary;
import com.zyz.mapper.ResourceLibraryMapper;
import com.zyz.service.ResourceLibraryService;
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
 * @since 2026-08-13
 */
@Service
@Transactional
public class ResourceLibraryServiceImpl extends ServiceImpl<ResourceLibraryMapper, ResourceLibrary> implements ResourceLibraryService {
	@Autowired
	ResourceLibraryMapper ResourceLibraryMapper;
	
	@Override
	public boolean resotreResourceLibrary(String id) {
		return ResourceLibraryMapper.resotreResourceLibrary(id) > 0;
	}
}
