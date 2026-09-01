package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.ResourceLibrary;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2026-08-13
 */
public interface ResourceLibraryMapper extends BaseMapper<ResourceLibrary> {
	@Update("update resource_library set status=1 where id = #{id}")
	int resotreResourceLibrary(String id);
}
