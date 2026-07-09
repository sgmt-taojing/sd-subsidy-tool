# 山东数转奖补自测工具

**在线体验：** https://sgmt-taojing.github.io/sd-subsidy-tool/

## 当前版本

**v3.0（2026-07-09）**：城市政策贴合版 · 企业自检评估

- 全国7个省份 + 数转试点城市（山东10市/江苏8市/浙江7市/广东7市/河南5市/四川5市）
- 四步流程：选省份 → 选城市 → 自检评估 → 填基础信息 → 奖补测算
- 10城市各具专属检查项（税务/环保/安全/行业门槛/资质认证）
- 条件依赖：选"化工"才出现"化工园区认定"等关联问题
- 未选提示"请点击上方选项确认"，明确失败才显示失败原因
- 奖补公式修正：subsidy = min(场景费×40%, 城市估算上限)

## 技术栈

H5版：原生 HTML + CSS + JavaScript（零依赖，浏览器直接打开）
小程序版：微信小程序框架（需微信开发者工具）

## GitHub

- 仓库：https://github.com/sgmt-taojing/sd-subsidy-tool
- Pages：https://sgmt-taojing.github.io/sd-subsidy-tool/
