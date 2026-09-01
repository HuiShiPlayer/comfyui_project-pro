package templete;

import java.sql.SQLException;

import com.baomidou.mybatisplus.enums.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.TemplateConfig;
import com.baomidou.mybatisplus.generator.config.rules.DbType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

public class GeneratorBack {

	static String path = System.getProperty("user.dir") + "\\";
	static String userName = "7theaven";
	static DbType dbType = DbType.MYSQL;
	static String driverNameString = "com.mysql.jdbc.Driver";

	static String url = "jdbc:mysql://127.0.0.1:3306/comfyui?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false";
	static String name = "root";
	static String pwd = "root";

	static String[] tableName = {"resource_class"};
	static String basePackage = "com.zyz";

	public static void main(String[] args) throws SQLException {
		System.out.println(path);
		// 1. 全局配置
		GlobalConfig config = new GlobalConfig();
		config.setActiveRecord(true) // 是否支持AR模式
				.setAuthor(userName) // 作者
				.setOutputDir(path+"\\src\\main\\java") // 生成路径
				.setFileOverride(false) // 文件覆盖
				.setIdType(IdType.AUTO) // 主键策略
				.setServiceName("%sService") // 设置生成的service接口的名字的首字母是否为I
				.setServiceImplName("%sServiceImpl")
				.setControllerName("%sController")
				.setMapperName("%sMapper")
                .setXmlName("%sMapper") 
				.setBaseResultMap(true)// 生成基本的resultMap
				.setBaseColumnList(true)// 生成基本的SQL片段
				.setEnableCache(false);// XML 二级缓存
			

		// 2. 数据源配置
		DataSourceConfig dsConfig = new DataSourceConfig();
		dsConfig.setDbType(dbType) // 设置数据库类型
				.setDriverName(driverNameString).setUrl(url).setUsername(name)
				.setPassword(pwd);

		// 3. 策略配置globalConfiguration中
		StrategyConfig stConfig = new StrategyConfig();
		stConfig.setCapitalMode(true) // 全局大写命名
				.setDbColumnUnderline(true) // 指定表名 字段名是否使用下划线
				.setNaming(NamingStrategy.underline_to_camel) // 数据库表映射到实体的命名策略
				//.setTablePrefix(dbTablePre)
				.setInclude(tableName) // 生成的表
				.setEntityLombokModel(true);

		// 4. 包名策略配置
		PackageConfig pkConfig = new PackageConfig();
		pkConfig.setParent(basePackage)
				.setEntity("pojo")
		 	    .setMapper("mapper")// dao
		 	    .setXml("mapper")// mapper.xml
				.setService("service")// servcie
				.setController("controller")// controller
				.setServiceImpl("service.impl");
		// 5. 整合配置
		AutoGenerator ag = new AutoGenerator();
		ag.setTemplate(new TemplateConfig()
				.setEntity("/templates/MyPojo.java")
				.setMapper("/templates/MyMapper.java")
				.setService("/templates/MyService.java")
				.setServiceImpl("/templates/MyServiceImpl.java")
				.setController("/templates/MyController.java"));
		

		ag.setGlobalConfig(config).setDataSource(dsConfig).setStrategy(stConfig).setPackageInfo(pkConfig);

		// 6. 执行
		ag.execute();
	}
}
