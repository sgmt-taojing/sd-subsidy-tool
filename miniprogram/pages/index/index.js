// 奖补测算核心逻辑
const subsidyRules = {
  '济南': { baseMax: 100, industryBonus: { 机械制造: 1.1, 食品加工: 1.0, 化工: 1.0, 电子: 1.15, 纺织: 0.95, 其他: 1.0 }, levelMultiplier: { 无: 1.2, 基础: 1.0, 部分: 0.8, 较完善: 0.6 } },
  '青岛': { baseMax: 100, industryBonus: { 机械制造: 1.0, 食品加工: 0.95, 化工: 1.05, 电子: 1.2, 纺织: 0.9, 其他: 1.0 }, levelMultiplier: { 无: 1.2, 基础: 1.0, 部分: 0.8, 较完善: 0.6 } },
  '烟台': { baseMax: 80, industryBonus: { 机械制造: 1.15, 食品加工: 1.0, 化工: 1.2, 电子: 1.0, 纺织: 0.9, 其他: 1.0 }, levelMultiplier: { 无: 1.15, 基础: 1.0, 部分: 0.85, 较完善: 0.65 } },
  '淄博': { baseMax: 60, industryBonus: { 机械制造: 1.0, 食品加工: 0.95, 化工: 1.25, 电子: 1.0, 纺织: 1.05, 其他: 1.0 }, levelMultiplier: { 无: 1.1, 基础: 1.0, 部分: 0.85, 较完善: 0.7 } },
  '济宁': { baseMax: 50, industryBonus: { 机械制造: 1.2, 食品加工: 1.1, 化工: 1.0, 电子: 1.0, 纺织: 1.1, 其他: 1.0 }, levelMultiplier: { 无: 1.1, 基础: 1.0, 部分: 0.9, 较完善: 0.7 } },
  '东营': { baseMax: 80, industryBonus: { 机械制造: 1.0, 食品加工: 0.9, 化工: 1.3, 电子: 1.0, 纺织: 0.85, 其他: 1.0 }, levelMultiplier: { 无: 1.15, 基础: 1.0, 部分: 0.85, 较完善: 0.65 } },
}
const sceneCostMap = { 生产报工: 8, 设备联网: 12, 质量追溯: 10, 全都要: 25 }

const employeeBonus = { '1-50': 0, '51-200': 5, '201-500': 10, '500+': 15 }

Page({
  data: {
    cities: ['济南', '青岛', '烟台', '淄博', '济宁', '东营'],
    employeeOptions: [
      { value: '1-50', label: '1-50人（微型）' },
      { value: '51-200', label: '51-200人（小型）' },
      { value: '201-500', label: '201-500人（中型）' },
      { value: '500+', label: '500人以上（规上）' },
    ],
    industryOptions: [
      { value: '机械制造', label: '机械制造' },
      { value: '食品加工', label: '食品加工' },
      { value: '化工', label: '化工/石化' },
      { value: '电子', label: '电子/电气' },
      { value: '纺织', label: '纺织/服装' },
      { value: '其他', label: '其他制造业' },
    ],
    levelOptions: [
      { value: '无', label: '基本为零，全靠手工' },
      { value: '基础', label: '用Excel/ERP，但没打通' },
      { value: '部分', label: '个别环节已数字化' },
      { value: '较完善', label: '大部分已信息化' },
    ],
    sceneOptions: [
      { value: '生产报工', label: '生产报工数字化' },
      { value: '设备联网', label: '设备联网监控' },
      { value: '质量追溯', label: '质量追溯系统' },
      { value: '全都要', label: '以上全部' },
    ],
    form: { city: '', employee: '', industry: '', level: '', scene: '' },
    canSubmit: false,
    submitting: false,
  },

  onCityChange(e) {
    const val = this.data.cities[e.detail.value]
    this.setData({ 'form.city': val }, this.checkSubmit)
  },

  onSelect(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: value }, this.checkSubmit)
  },

  checkSubmit() {
    const f = this.data.form
    const can = !!(f.city && f.employee && f.industry && f.level && f.scene)
    this.setData({ canSubmit: can })
  },

  onSubmit() {
    if (!this.data.canSubmit) return
    this.setData({ submitting: true })
    const f = this.data.form
    const rule = subsidyRules[f.city]
    if (!rule) { wx.showToast({ title: '暂不支持该城市', icon: 'none' }); return }

    const base = rule.baseMax
    const industryMul = rule.industryBonus[f.industry] || 1.0
    const levelMul = rule.levelMultiplier[f.level] || 1.0
    const empBonus = employeeBonus[f.employee] || 0
    const sceneCost = sceneCostMap[f.scene] || 10

    // 奖补估算 ≈ base * 行业系数 * 数转水平系数 + 员工规模补贴
    const estimate = Math.round(base * industryMul * levelMul * 0.5 + empBonus)
    const capped = Math.min(estimate, rule.baseMax + empBonus)
    const subsidy = Math.min(Math.round(sceneCost * 0.4), capped)
    const selfPay = sceneCost - subsidy

    const resultData = {
      city: f.city,
      estimateHigh: capped,
      estimateLow: Math.round(capped * 0.6),
      sceneCost: sceneCost,
      selfPay: selfPay,
      date: new Date().toLocaleDateString('zh-CN'),
      tips: [],
      nextSteps: [],
    }

    if (capped >= 50) resultData.tips.push('根据企业规模和政策覆盖，你属于高优先支持对象')
    if (f.level === '无' || f.level === '基础') resultData.tips.push('数字化基础薄弱=改造空间大=奖补优先级高')
    if (f.scene !== '全都要') resultData.tips.push('先做一个场景打出效果，后续扩展更容易')
    resultData.nextSteps = ['联系淘景数科获取详细申报方案', '安排免费工厂数字化诊断', '准备申报材料提交工信局']

    // 添加奖补攻略PDF领取钩子
    resultData.leadCapture = {
      show: true,
      message: `你预计可申领 ${capped}万 奖补资金，项目实际自付约 ${selfPay}万（补贴后）`,
    }

    wx.setStorageSync('subsidy_result', resultData)
    this.setData({ submitting: false })
    wx.navigateTo({ url: '/pages/result/result' })
  }
})
