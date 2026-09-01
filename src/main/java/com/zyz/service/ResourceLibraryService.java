package com.zyz.service;

import com.zyz.pojo.ResourceLibrary;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2026-08-13
 */
public interface ResourceLibraryService extends IService<ResourceLibrary> {
	boolean resotreResourceLibrary(String id);
}
