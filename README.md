# 山东数转奖补自测工具

淘景数科 — 中小企业数字化转型奖补自测小程序

## 项目说明

面向山东省6个重点城市（济南、青岛、烟台、淄博、济宁、东营）的中小制造企业，提供一个免费的奖补自测工具。用户填写几个基本信息，即可估算可获得的数字化转型奖补金额。

## 目录结构

```
├── miniprogram/          # 微信小程序源码
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── project.config.json
│   ├── pages/
│   │   ├── index/        # 自测表单页
│   │   ├── result/       # 测算结果页
│   │   └── about/        # 关于我们
│   └── images/           # 图标资源
│
├── web-test/             # Web测试版（可直接浏览器运行）
│   └── index.html        # 单页应用，零依赖
│
└── README.md
```

## 本地测试

### Web版（推荐，无需IDE）

直接用浏览器打开 `web-test/index.html` 即可运行。

### 微信小程序版

1. 下载[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入 `miniprogram/` 目录
3. 修改 `project.config.json` 中的 `appid` 为你的小程序AppID
4. 在开发者工具中预览

## 部署到 GitHub Pages

1. 将此仓库推送到 GitHub
2. 在仓库 Settings → Pages 中选择 Source: "Deploy from a branch"
3. 选择 main 分支，目录选择 `/web-test`
4. 访问 `https://你的用户名.github.io/此仓库名/web-test/index.html`

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v0.1 | 2026-07-08 | 山东6市奖补自测，生产报工/设备联网/质量追溯3场景 |

## 淘景数科

制造业数字化转型"小快轻准"方案提供商
官网：https://www.taojingshuke.com
