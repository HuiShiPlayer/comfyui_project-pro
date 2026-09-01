package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.Api;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
public interface ApiMapper extends BaseMapper<Api> {
	@Update("update api set status=1 where id = #{id}")
	int resotreApi(String id);
}
