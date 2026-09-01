package com.zyz.service;

import com.zyz.pojo.Prompt;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-12-24
 */
public interface PromptService extends IService<Prompt> {
	boolean resotrePrompt(String id);
}
