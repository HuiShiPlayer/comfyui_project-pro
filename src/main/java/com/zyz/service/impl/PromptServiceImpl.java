package com.zyz.service.impl;

import com.zyz.pojo.Prompt;
import com.zyz.mapper.PromptMapper;
import com.zyz.service.PromptService;
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
public class PromptServiceImpl extends ServiceImpl<PromptMapper, Prompt> implements PromptService {
	@Autowired
	PromptMapper PromptMapper;
	
	@Override
	public boolean resotrePrompt(String id) {
		return PromptMapper.resotrePrompt(id) > 0;
	}
}
