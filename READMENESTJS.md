# 创建项目

## 使用脚手架创建项目

- 安装脚手架

```bash
npm i -g @nestjs/cli
```

- 创建基础项目

```bash
nest new dome-server
```

- 目录结构

```bash
src
 ├── app.controller.spec.ts
 ├── app.controller.ts  # 控制器
 ├── app.module.ts      # 模块定义
 ├── app.service.ts     # service层
 └── main.ts            # 入口
```

- 利用CLI 生成代码

```bash
nest g mo xxx   # 生成 Module
nest g co xxx  # 生成 Controller
nest g s xxx   # 生成 Service
nest g resource xxx # 生成一套Restful风格接口
```
