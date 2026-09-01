package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.GenerateRecords;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-01
 */
public interface GenerateRecordsMapper extends BaseMapper<GenerateRecords> {
	@Update("update generate_records set status=1 where id = #{id}")
	int resotreGenerateRecords(String id);
}
