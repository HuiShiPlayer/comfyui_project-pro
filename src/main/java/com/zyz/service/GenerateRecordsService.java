package com.zyz.service;

import com.zyz.pojo.GenerateRecords;
import com.baomidou.mybatisplus.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-01
 */
public interface GenerateRecordsService extends IService<GenerateRecords> {
	boolean resotreGenerateRecords(String id);
}
