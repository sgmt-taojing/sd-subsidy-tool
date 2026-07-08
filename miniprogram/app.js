App({
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
  },
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})
