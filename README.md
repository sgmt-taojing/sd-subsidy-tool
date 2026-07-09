# 山东数转奖补自测工具

**在线体验：** https://sgmt-taojing.github.io/sd-subsidy-tool/

## 当前版本

**v3.0（2026-07-09）**：城市政策贴合版 · 企业自检评估

- 四步流程：选城市 → 自检评估 → 填基础信息 → 奖补测算
- 10城市各具专属检查项（税务/环保/安全/行业门槛/资质认证等）
- 条件依赖：选"化工"才出现"化工园区认定"等关联问题
- 未通过自检直接告知原因，不浪费后续时间

## 历史版本

- v2.0（2026-07-08）：优化版，仅基础奖补计算
- v1.0（2026-07-08）：初版，基础功能

## 文件说明

```
v0.1/            ← 当前小程序开发目录
  index.html     ← H5版（GitHub Pages 部署版本，与 v3.0 同步）
  web-test/      ← 历史版本存档
  miniprogram/   ← 微信小程序源码（需微信开发者工具打开）
```

## GitHub

- 仓库：https://github.com/sgmt-taojing/sd-subsidy-tool
- Pages：https://sgmt-taojing.github.io/sd-subsidy-tool/

## 技术栈

H5版：原生 HTML + CSS + JavaScript（零依赖，可直接浏览器打开）
小程序版：微信小程序框架（需微信开发者工具）
