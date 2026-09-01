package com.zyz.service.impl;

import com.zyz.pojo.GenerateRecords;
import com.zyz.mapper.GenerateRecordsMapper;
import com.zyz.service.GenerateRecordsService;
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
 * @since 2025-11-01
 */
@Service
@Transactional
public class GenerateRecordsServiceImpl extends ServiceImpl<GenerateRecordsMapper, GenerateRecords> implements GenerateRecordsService {
	@Autowired
	GenerateRecordsMapper GenerateRecordsMapper;
	
	@Override
	public boolean resotreGenerateRecords(String id) {
		return GenerateRecordsMapper.resotreGenerateRecords(id) > 0;
	}
}
