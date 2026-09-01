package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.Config;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2025-11-10
 */
public interface ConfigMapper extends BaseMapper<Config> {
	@Update("update config set status=1 where id = #{id}")
	int resotreConfig(String id);
	int updateAllIPData(String ip);
}
