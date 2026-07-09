// 奖补自测 v3.0
// 核心升级：城市自检评估 + 政策贴合 + 动态检查项

const sceneCostMap = {
  '生产报工': 8,
  '设备联网': 12,
  '质量追溯': 10,
  '全都要': 25,
  '全场景（深度）': 35,
};

// ============================================================
// 各城市自检评估项（城市选完后加载）
// type: required=必填项 | optional=选填项
// passValue: 选了哪个值表示通过
// ============================================================
const cityCheckItems = {
  '济南': {
    label: '济南 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务记录是申报门槛，近2年无欠税' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信企业无法申报' },
      { key: 'safety', label: '近3年无重大安全事故', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '安全生产一票否决' },
      { key: 'location', label: '注册地是否在高新区/经开区？', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否（济南其他区域也可）', value: false }], tip: '高新区/经开区企业优先，济南其他区域也可申报' },
      { key: 'budget', label: '是否有数字化转型预算？', type: 'optional', options: [{ text: '有，10万以上 ✓', value: true }, { text: '暂无预算', value: false }], tip: '有预算可加快启动' },
      { key: 'plan', label: '是否已有数转方案或计划？', type: 'optional', options: [{ text: '有 ✓', value: true }, { text: '暂无，我们帮您做', value: false }], tip: '暂无方案不影响申报，可由我们协助制定' },
    ],
    subsidyRules: { baseMax: 100, industryBonus: { '机械制造': 1.1, '食品加工': 1.0, '化工': 1.0, '电子': 1.15, '纺织': 0.95, '其他': 1.0 }, levelMultiplier: { '无': 1.2, '基础': 1.0, '部分': 0.8, '较完善': 0.6 } },
    note: '济南是山东省会，政策来源地，申报通道最全，建议优先联系市工信局了解最新批次安排',
  },
  '青岛': {
    label: '青岛 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务是硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信企业一票否决' },
      { key: 'env', label: '近3年无重大环保处罚', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '环保处罚影响申报资格' },
      { key: 'iim', label: '是否已做两化融合管理体系贯标？', type: 'optional', options: [{ text: '已通过 ✓', value: 'done' }, { text: '未做，不影响申报', value: false }], tip: '已贯标企业优先，但不是必须条件' },
      { key: 'internet', label: '是否有工业互联网平台使用计划？', type: 'optional', options: [{ text: '有 ✓', value: true }, { text: '暂无计划', value: false }], tip: '青岛工业互联网生态成熟，有计划加分' },
      { key: 'scale', label: '是否属于规上工业企业（年营收≥2000万）？', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否（暂不符合申报条件）', value: false }], tip: '规上企业是青岛申报的基本门槛' },
    ],
    subsidyRules: { baseMax: 100, industryBonus: { '机械制造': 1.0, '食品加工': 0.95, '化工': 1.05, '电子': 1.2, '纺织': 0.9, '其他': 1.0 }, levelMultiplier: { '无': 1.2, '基础': 1.0, '部分': 0.8, '较完善': 0.6 } },
    note: '青岛政策开放度最高，工业互联网生态全国领先，已贯标两化融合的企业优先',
  },
  '烟台': {
    label: '烟台 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'env', label: '近3年无重大环保处罚', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '烟台化工多，环保核查严格' },
      { key: 'safety', label: '近3年无重大安全事故', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '安全生产一票否决，尤其化工企业' },
      { key: 'chem', label: '是否为化工企业？', type: 'required', options: [{ text: '是', value: 'chem' }, { text: '否（非化工企业直接通过）', value: false }], tip: '化工企业需提供安全生产许可证，并须通过化工产业转型升级审核' },
      { key: 'chemCert', label: '化工企业：是否有有效安全生产许可证？', type: 'required', passIf: (ans) => ans !== 'chem' || true, options: [{ text: '有 ✓', value: true }, { text: '无（化工企业必须有）', value: false }], tip: '化工企业无安全生产许可证无法申报', condition: { key: 'chem', value: 'chem' } },
    ],
    subsidyRules: { baseMax: 80, industryBonus: { '机械制造': 1.15, '食品加工': 1.0, '化工': 1.2, '电子': 1.0, '纺织': 0.9, '其他': 1.0 }, levelMultiplier: { '无': 1.15, '基础': 1.0, '部分': 0.85, '较完善': 0.65 } },
    note: '烟台化工重镇，化工企业门槛高（需安全许可+产业升级审核），非化工企业机会更大',
  },
  '潍坊': {
    label: '潍坊 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'scale', label: '是否属于规模以上工业企业（年营收≥2000万）？', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '潍坊是山东第一制造业大市，规上企业是申报基础' },
      { key: 'plan', label: '是否有初步数字化转型方案或改造计划？', type: 'optional', options: [{ text: '有 ✓', value: true }, { text: '暂无，我们可以协助制定', value: false }], tip: '有方案优先受理，但不是硬性条件' },
      { key: 'invest', label: '预计数转投入金额？', type: 'optional', options: [{ text: '10万以上 ✓', value: 'high' }, { text: '5-10万', value: 'mid' }, { text: '5万以下', value: 'low' }], tip: '投入金额影响补贴额度' },
    ],
    subsidyRules: { baseMax: 80, industryBonus: { '机械制造': 1.1, '食品加工': 1.0, '化工': 1.15, '电子': 1.0, '纺织': 1.0, '其他': 1.0 }, levelMultiplier: { '无': 1.2, '基础': 1.0, '部分': 0.8, '较完善': 0.6 } },
    note: '潍坊制造业体量山东第一，规上企业多，竞争相对激烈，建议提前准备材料',
  },
  '淄博': {
    label: '淄博 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'env', label: '近3年无重大环保处罚', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '淄博陶瓷/化工多，环保是重点' },
      { key: 'industry', label: '属于哪个细分行业？', type: 'required', options: [{ text: '化工', value: 'chem' }, { text: '陶瓷/建材', value: 'ceramic' }, { text: '纺织', value: 'textile' }, { text: '其他制造业', value: 'other' }], tip: '化工和建材行业有额外门槛' },
      { key: 'chemEnv', label: '化工企业：环保绩效评级是否B级及以上？', type: 'required', options: [{ text: 'B级及以上 ✓', value: true }, { text: 'C级或以下', value: false }, { text: '我不是化工企业', value: 'na' }], tip: '淄博化工企业须达到B级以上环保绩效', condition: { key: 'industry', value: 'chem' } },
      { key: 'ceramicLow', label: '陶瓷/建材企业：是否完成超低排放改造？', type: 'required', options: [{ text: '已完成 ✓', value: true }, { text: '未完成或不了解', value: false }, { text: '我不是陶瓷/建材', value: 'na' }], tip: '淄博建材企业须完成超低排放改造', condition: { key: 'industry', value: 'ceramic' } },
    ],
    subsidyRules: { baseMax: 60, industryBonus: { '机械制造': 1.0, '食品加工': 0.95, '化工': 1.25, '电子': 1.0, '纺织': 1.05, '其他': 1.0 }, levelMultiplier: { '无': 1.1, '基础': 1.0, '部分': 0.85, '较完善': 0.7 } },
    note: '淄博化工系数全省最高(×1.25)，但化工企业有额外环保门槛；陶瓷/建材需超低排放改造',
  },
  '济宁': {
    label: '济宁 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'rd', label: '企业是否有研发机构（研究所/实验室）？', type: 'optional', options: [{ text: '有 ✓', value: true }, { text: '暂无', value: false }], tip: '机械装备企业有研发机构优先，但不是硬性条件' },
      { key: 'assessment', label: '是否已做过济宁市智能制造能力成熟度评估？', type: 'optional', options: [{ text: '已做过（1-3级）✓', value: true }, { text: '未做过，不影响申报', value: false }], tip: '已评估企业优先，但不是硬性条件' },
    ],
    subsidyRules: { baseMax: 50, industryBonus: { '机械制造': 1.2, '食品加工': 1.1, '化工': 1.0, '电子': 1.0, '纺织': 1.1, '其他': 1.0 }, levelMultiplier: { '无': 1.1, '基础': 1.0, '部分': 0.9, '较完善': 0.7 } },
    note: '济宁装备制造强项，机械行业系数高(×1.2)；竞争相对较小，建议提前联系工信局',
  },
  '东营': {
    label: '东营 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'env', label: '近3年无重大环保处罚', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '东营化工占主导，环保是重点审查项' },
      { key: 'safety', label: '近3年无重大安全事故', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '安全生产一票否决，尤其化工' },
      { key: 'industry', label: '属于哪个细分行业？', type: 'required', options: [{ text: '化工/石化', value: 'chem' }, { text: '石油装备', value: 'equip' }, { text: '其他制造业', value: 'other' }], tip: '东营化工占工业80%+' },
      { key: 'chemPark', label: '化工企业：是否在经认定的化工园区内？', type: 'required', options: [{ text: '在园区内 ✓', value: true }, { text: '不在园区（无法申报）', value: false }, { text: '我不是化工', value: 'na' }], tip: '东营化工企业必须在化工园区内，这是硬门槛', condition: { key: 'industry', value: 'chem' } },
      { key: 'safetyLevel', label: '化工企业：安全评级是否达到C级以上？', type: 'required', options: [{ text: 'C级或以上 ✓', value: true }, { text: 'D级（不合格）', value: false }, { text: '我不是化工', value: 'na' }], tip: '化工企业安全评级必须达到C级', condition: { key: 'industry', value: 'chem' } },
    ],
    subsidyRules: { baseMax: 80, industryBonus: { '机械制造': 1.0, '食品加工': 0.9, '化工': 1.3, '电子': 1.0, '纺织': 0.85, '其他': 1.0 }, levelMultiplier: { '无': 1.15, '基础': 1.0, '部分': 0.85, '较完善': 0.65 } },
    note: '东营化工天下，化工系数全省最高(×1.3)；但化工企业必须在园区+安全C级，硬门槛多；胜利油田生态是独特优势',
  },
  '临沂': {
    label: '临沂 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'industry', label: '属于哪个细分行业？', type: 'required', options: [{ text: '食品加工', value: 'food' }, { text: '商贸/物流配套制造', value: 'commerce' }, { text: '其他制造业', value: 'other' }], tip: '临沂食品/商贸发达' },
      { key: 'foodCert', label: '食品企业：是否持有有效SC生产许可证？', type: 'required', options: [{ text: '有 ✓', value: true }, { text: '无或过期', value: false }, { text: '我不是食品企业', value: 'na' }], tip: '临沂食品加工企业多，SC证是硬门槛', condition: { key: 'industry', value: 'food' } },
      { key: 'foodSafety', label: '食品企业：近3年是否通过食品安全监督审核？', type: 'required', options: [{ text: '通过 ✓', value: true }, { text: '有违规记录', value: false }, { text: '我不是食品', value: 'na' }], tip: '食品安全是临沂食品企业的核心审查点', condition: { key: 'industry', value: 'food' } },
    ],
    subsidyRules: { baseMax: 60, industryBonus: { '机械制造': 1.0, '食品加工': 1.15, '化工': 1.0, '电子': 1.0, '纺织': 1.0, '其他': 1.0 }, levelMultiplier: { '无': 1.1, '基础': 1.0, '部分': 0.85, '较完善': 0.65 } },
    note: '临沂食品系数最高(×1.15)，商贸活跃；Q4跟进城市，7-9月重点在试点城市',
  },
  '威海': {
    label: '威海 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'industry', label: '属于哪个细分行业？', type: 'required', options: [{ text: '食品加工', value: 'food' }, { text: '纺织/服装', value: 'textile' }, { text: '其他制造业', value: 'other' }], tip: '威海食品/纺织出口导向明显' },
      { key: 'foodHaccp', label: '食品企业：是否建立HACCP质量管理体系？', type: 'required', options: [{ text: '已建立 ✓', value: true }, { text: '未建立', value: false }, { text: '我不是食品', value: 'na' }], tip: '威海食品出口多，HACCP是行业特色要求', condition: { key: 'industry', value: 'food' } },
      { key: 'trace', label: '是否有质量追溯体系建设计划？', type: 'optional', options: [{ text: '有 ✓', value: true }, { text: '暂无', value: false }], tip: '威海食品出口要求质量追溯，有计划加分' },
    ],
    subsidyRules: { baseMax: 50, industryBonus: { '机械制造': 1.0, '食品加工': 1.5, '化工': 0.85, '电子': 1.0, '纺织': 1.2, '其他': 1.0 }, levelMultiplier: { '无': 1.1, '基础': 1.0, '部分': 0.85, '较完善': 0.65 } },
    note: '威海食品行业系数全省最高(×1.5)！出口导向，HACCP认证是特色要求',
  },
  '泰安': {
    label: '泰安 · 申报条件自检',
    items: [
      { key: 'tax', label: '依法纳税，无欠税记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '税务硬门槛' },
      { key: 'credit', label: '信用中国无黑名单记录', type: 'required', options: [{ text: '是 ✓', value: true }, { text: '否 ✗', value: false }], tip: '失信一票否决' },
      { key: 'tech', label: '是否为高新技术企业？', type: 'optional', options: [{ text: '是 ✓', value: true }, { text: '否（不影响申报）', value: false }], tip: '泰安高新技术企业优先，但不是硬性条件' },
      { key: 'budget', label: '是否有智能化改造投入预算？', type: 'optional', options: [{ text: '有明确预算 ✓', value: true }, { text: '暂无（我们可以帮您规划）', value: false }], tip: '有预算的企业优先' },
    ],
    subsidyRules: { baseMax: 50, industryBonus: { '机械制造': 1.1, '食品加工': 1.0, '化工': 1.0, '电子': 1.05, '纺织': 1.0, '其他': 1.0 }, levelMultiplier: { '无': 1.1, '基础': 1.0, '部分': 0.85, '较完善': 0.65 } },
    note: '泰安Q4跟进城市；机械装备是主攻方向，条件相对宽松',
  },
};

// 通用员工规模补贴
const employeeBonus = {
  '1-50': 0,
  '51-200': 5,
  '201-500': 10,
  '500+': 15,
};

Page({
  data: {
    // 阶段控制
    step: 1, // 1=选择城市, 2=自检评估, 3=基础信息, 4=结果
    // 步骤1数据
    provinces: ['山东省'],
    cities: ['济南', '青岛', '烟台', '潍坊', '淄博', '济宁', '东营', '临沂', '威海', '泰安'],
    selectedProvince: '山东省',
    selectedCity: '',
    // 步骤2数据（城市选完后动态加载）
    checkItems: [],
    checkAnswers: {},     // { key: selectedValue }
    checkStatus: {},      // { key: 'pass'|'fail'|'pending' }
    checkPassed: null,    // null=未校验, true=通过, false=未通过
    disqualifyReasons: [], // 未通过原因列表
    // 步骤3数据（通过自检后）
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
      { value: '生产报工', label: '生产报工数字化（8万起）' },
      { value: '设备联网', label: '设备联网监控（12万起）' },
      { value: '质量追溯', label: '质量追溯系统（10万起）' },
      { value: '全都要', label: '三合一全场景（25万起）' },
      { value: '全场景（深度）', label: '深度定制版（35万起）' },
    ],
    form: { employee: '', industry: '', level: '', scene: '' },
    canSubmit: false,
    submitting: false,
    cityNote: '',
  },

  // =====================================================
  // 步骤1：城市选择
  // =====================================================
  onProvinceChange(e) {
    // 目前只有山东省，未来扩展
    this.setData({ selectedProvince: this.data.provinces[e.detail.value] })
  },

  onCityChange(e) {
    const city = this.data.cities[e.detail.value]
    const cityData = cityCheckItems[city]
    if (!cityData) return

    this.setData({
      selectedCity: city,
      checkItems: cityData.items,
      cityNote: cityData.note,
      step: 2,
      checkAnswers: {},
      checkStatus: {},
      checkPassed: null,
      disqualifyReasons: [],
    })
    wx.pageScrollTo({ selector: '.page-title', duration: 300 })
  },

  // =====================================================
  // 步骤2：自检评估
  // =====================================================
  onCheckItemSelect(e) {
    const { key, value } = e.currentTarget.dataset
    const item = this.data.checkItems.find(i => i.key === key)
    const answer = value

    // 条件依赖：某些题目只在特定答案下显示
    if (item.condition) {
      const condKey = item.condition.key
      const condVal = item.condition.value
      const condAnswer = this.data.checkAnswers[condKey]
      if (condAnswer !== condVal) {
        return // 条件不满足，不处理
      }
    }

    const newAnswers = { ...this.data.checkAnswers, [key]: answer }
    let newStatus = { ...this.data.checkStatus }

    // 计算本题状态
    const passIfRequired = item.type === 'required'
    let isPass = true
    if (passIfRequired) {
      if (typeof item.passIf === 'function') {
        isPass = item.passIf(answer)
      } else {
        const passOption = item.options.find(o => o.value === true || o.value === 'done')
        isPass = passOption ? answer === passOption.value : !!value
      }
    } else {
      isPass = true // 选填题默认通过
    }
    newStatus[key] = isPass ? 'pass' : 'fail'

    this.setData({
      checkAnswers: newAnswers,
      checkStatus: newStatus,
    })
  },

  // 是否显示某个检查项（条件依赖）
  isCheckItemVisible(item) {
    if (!item.condition) return true
    const condAnswer = this.data.checkAnswers[item.condition.key]
    return condAnswer === item.condition.value
  },

  // 提交自检
  onCheckSubmit() {
    const items = this.data.checkItems
    const answers = this.data.checkAnswers
    const status = this.data.checkStatus
    const reasons = []

    let allPass = true
    for (const item of items) {
      // 条件不满足的题目跳过
      if (item.condition) {
        const condAnswer = answers[item.condition.key]
        if (condAnswer !== item.condition.value) continue
      }
      if (item.type === 'required') {
        if (status[item.key] !== 'pass') {
          allPass = false
          reasons.push({
            label: item.label,
            tip: item.tip,
            answer: answers[item.key],
          })
        }
      }
    }

    this.setData({
      checkPassed: allPass,
      disqualifyReasons: reasons,
    })

    if (allPass) {
      wx.pageScrollTo({ selector: '.check-submit-btn', duration: 300 })
    }
  },

  // 点击城市标签快速选择
  onCityTap(e) {
    const city = e.currentTarget.dataset.city
    const cityData = cityCheckItems[city]
    if (!cityData) return
    this.setData({
      selectedCity: city,
      checkItems: cityData.items,
      cityNote: cityData.note,
      step: 2,
      checkAnswers: {},
      checkStatus: {},
      checkPassed: null,
      disqualifyReasons: [],
    })
    wx.pageScrollTo({ selector: '.page-title', duration: 300 })
  },

  // 返回步骤1
  onBackToStep1() {
    this.setData({
      step: 1,
      selectedCity: '',
      checkItems: [],
      checkPassed: null,
      disqualifyReasons: [],
    })
  },

  // 返回步骤2
  onBackToStep2() {
    this.setData({ step: 2 })
    wx.pageScrollTo({ selector: '.page-title', duration: 300 })
  },

  // 通过自检，继续填写基础信息
  onContinueToForm() {
    this.setData({ step: 3 })
    wx.pageScrollTo({ selector: '.page-title', duration: 300 })
  },

  // =====================================================
  // 步骤3：基础信息 + 测算
  // =====================================================
  onSelect(e) {
    const { field, value } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: value }, this.checkSubmit)
  },

  checkSubmit() {
    const f = this.data.form
    this.setData({ canSubmit: !!(f.employee && f.industry && f.level && f.scene) })
  },

  onFormSubmit() {
    if (!this.data.canSubmit) {
      wx.showToast({ title: '请完整填写信息', icon: 'none' })
      return
    }
    this.setData({ submitting: true })

    const f = this.data.form
    const city = this.data.selectedCity
    const cityData = cityCheckItems[city]
    const rule = cityData.subsidyRules

    const base = rule.baseMax
    const industryMul = rule.industryBonus[f.industry] || 1.0
    const levelMul = rule.levelMultiplier[f.level] || 1.0
    const empBonus = employeeBonus[f.employee] || 0
    const sceneCost = sceneCostMap[f.scene] || 10

    // 奖补公式：subsidy = min(场景费用 × 40%, 估算奖补上限)
    const estimated = Math.round(base * industryMul * levelMul + empBonus)
    const capped = Math.min(estimated, rule.baseMax + empBonus)
    const subsidy = Math.min(Math.round(sceneCost * 0.4), capped)
    const selfPay = sceneCost - subsidy

    const resultData = {
      city,
      checkPassed: true,
      estimateHigh: capped,
      estimateLow: Math.round(capped * 0.6),
      sceneCost,
      subsidy,
      selfPay,
      date: new Date().toLocaleDateString('zh-CN'),
      checkItems: this.data.checkItems,
      checkAnswers: this.data.checkAnswers,
      checkStatus: this.data.checkStatus,
      tips: [],
      nextSteps: [],
      cityNote: cityData.note,
    }

    // 根据答案生成个性化建议
    if (f.level === '无' || f.level === '基础') {
      resultData.tips.push('数字化基础薄弱=改造空间大=奖补优先级高')
    }
    if (f.scene === '全都要' || f.scene === '全场景（深度）') {
      resultData.tips.push('全场景项目奖补额度更高，建议优先考虑')
    }
    if (city === '东营' && resultData.checkAnswers.industry === 'chem') {
      resultData.tips.push('东营化工系数全省最高(×1.3)，奖补金额可观')
    }
    if (city === '威海' && resultData.checkAnswers.industry === 'food') {
      resultData.tips.push('威海食品行业系数全省最高(×1.5)，出口认证完善是加分项')
    }

    resultData.nextSteps = [
      `联系淘景数科，制定${city}专属申报方案`,
      '安排免费工厂数字化诊断（45分钟上门）',
      `准备${city}工信局申报材料`,
    ]

    wx.setStorageSync('subsidy_result', resultData)
    this.setData({ submitting: false })
    wx.navigateTo({ url: '/pages/result/result' })
  },
})
