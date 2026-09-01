package com.zyz.service.impl;

import com.zyz.pojo.PromptClass;
import com.zyz.mapper.PromptClassMapper;
import com.zyz.service.PromptClassService;
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
 * @since 2025-12-24
 */
@Service
@Transactional
public class PromptClassServiceImpl extends ServiceImpl<PromptClassMapper, PromptClass> implements PromptClassService {
	@Autowired
	PromptClassMapper PromptClassMapper;
	
	@Override
	public boolean resotrePromptClass(String id) {
		return PromptClassMapper.resotrePromptClass(id) > 0;
	}
}
