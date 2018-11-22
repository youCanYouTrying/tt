//app.js
App({
 
  onLaunch: function () {
    wx.hideTabBar()
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // 获取用户信息
    wx.getSetting({
      success: res => {

        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => { //这里就是获取头像啊,什么什么的地方
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          //未授权
          // wx.openSetting({
          //   success:function(res){
             
          //   }
          // })
          
        }
      }
    })

    wx.getSystemInfo({
      success: res => {
        //  console.log('手机信息res'+res.model)
        let modelmes = res.model;
        this.globalData.getSystemInfo = res;
        if (modelmes.search('iPhone X') != -1) {
          this.globalData.isIphoneX = true
        }
      }
    })
    
  },

  globalData: {
    smName: '',
    latitude: '',
    longitude: '',
    openid:'',
    sheng: '',
    shi: '',
    qu: '',
    jiedao:'',
    adcode:'',
    url:'https://www.qiaoba.ren/',
    card:0,
    userId:'',
    userInfo: null,
    isIphoneX:false,
    shop_icon:'',
    rider_icon:'',
    user_icon:'',
    version:4,
    ticket:'',
    getSystemInfo:{},
    imgUrl:'https://www.qiaoba.ren/public/static/wechat/image/',
  }
})


