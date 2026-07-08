Page({
  data: { result: {} },
  onLoad() {
    const result = wx.getStorageSync('subsidy_result') || {}
    this.setData({ result })
  },
  onContact() {
    wx.showModal({
      title: '领取奖补指南',
      content: '感谢你的关注！顾问将在工作时间内联系你，发送完整版《山东6市奖补政策指南》。请确保手机畅通。',
      confirmText: '好的',
      success: () => {
        wx.navigateBack()
      }
    })
  }
})
