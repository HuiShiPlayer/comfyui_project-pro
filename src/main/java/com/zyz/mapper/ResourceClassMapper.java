package com.zyz.mapper;
import org.apache.ibatis.annotations.Update;
import com.zyz.pojo.ResourceClass;
import com.baomidou.mybatisplus.mapper.BaseMapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author 7theaven
 * @since 2026-08-14
 */
public interface ResourceClassMapper extends BaseMapper<ResourceClass> {
	@Update("update resource_class set status=1 where id = #{id}")
	int resotreResourceClass(String id);
}
