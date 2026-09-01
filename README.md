# 绘世玩家comfyui 批量管理系统
## 功能说明
1. 系统支持本地comfyui、远程comfyui、Runninghub 三大平台的 批量api 处理。
2. 支持批量文生图、批量图片编辑、批量图片参考、批量文生|图生|参考视频生成、批量资产操作等功能。
3. 支持任务工作流一键批量操作、支持任务可追溯、可编辑等功能。

## 项目环境
JAVA jdk1.8、mysql5.7、maven3.5

## 代码说明
项目代码是历时半年，由B站小伙伴不断的提出修改建议，B站绘世玩家独立编写代码而来，可本地部署，免费使用，无需登录，无需注册，请谨慎鉴别！！！项目代码很乱，不喜勿喷！本人不辩论技术问题~


## 安装包及使用教程地址：
https://www.bilibili.com/video/BV1j78J6tEtU?t=5.7

## 重要配置
- 配置文件application.properties
  - isDev = 1 #开发环境
  - outer.static.resources=###/comfyui_static  #开发环境需要指定资源目录地址（comfyui_static目录的地址）
    
  - isDev = 0 #生产环境 #生成环境自动寻找项目jar包所在地址中的 comfyui_static 目录地址
    
- 资源目录结构（必有），地址参考如上！
  - comfyui_static
    - input
      - resources
      - audioFileDir
      - dataFileDir
    - output
- 其他配置，参考配置文件中说明！
   
##
项目代码很乱，不喜勿喷~


