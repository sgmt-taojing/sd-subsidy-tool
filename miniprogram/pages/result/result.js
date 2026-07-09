// 结果页 v3.0
Page({
  data: {
    result: {},
    subsidyPercent: 0,
  },

  onLoad() {
    const result = wx.getStorageSync('subsidy_result') || {}
    this.setData({ result })

    // 计算奖补占项目费用比例
    if (result.sceneCost && result.subsidy) {
      this.setData({ subsidyPercent: Math.round((result.subsidy / result.sceneCost) * 100) })
    }
  },

  onShareAppMessage() {
    const r = this.data.result
    return {
      title: `我在${r.city || '山东'}做数转奖补自测，能拿${r.estimateHigh || '?'}万！`,
      path: '/pages/index/index',
    }
  },

  onShareTimeline() {
    const r = this.data.result
    return {
      title: `数转奖补自测：${r.city || '山东'}能拿${r.estimateHigh || '?'}万`,
      query: '',
    }
  },

  onContact() {
    wx.showModal({
      title: '领取完整申报方案',
      content: '顾问将在24小时内联系你，发送《' + (this.data.result.city || '山东') + '市数转奖补申报完整指南》。请保持手机畅通。',
      confirmText: '好的',
      cancelText: '先看看结果',
    })
  },

  onSaveResult() {
    wx.showToast({ title: '结果已保存，可分享给同事', icon: 'success' })
  },
})
