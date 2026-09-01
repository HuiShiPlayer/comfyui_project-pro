package com.zyz.service;

import com.zyz.pojo.PromptClass;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-12-24
 */
public interface PromptClassService extends IService<PromptClass> {
	boolean resotrePromptClass(String id);
}
