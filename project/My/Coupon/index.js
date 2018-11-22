var app = getApp();
var com = require("../../common.js");
var that = null;
Page({
  data: {
    isOk: false,
    Ynothing:false,
    Rnothing:false,
    topTable: [{
        id: "table1",
        name: "优惠券"
      },
      {
        id: "table2",
        name: "红包"
      }
    ],
    redPacket:[],//红包数组
    couponList:[],//优惠券数组
    currentTabId: "table1",
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0
  },
  onLoad: function(options) {
    let that = this;
    const imgUrl = getApp().globalData.imgUrl;
    const nowTimeStamp=com.getCurrentTimeStamp();
    this.setData({
      imgUrl: imgUrl,
      nowTimeStamp:nowTimeStamp
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        })
      }
    })
    
    //红包HTTP
    wx.request({
      url: app.globalData.url + 'userapi/red_packet/index',
      data: {
        uid: app.globalData.userId 
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        let redPacket = res.data.data.data
        let redPacket2=[]

        //删除过期的红包
        redPacket2 = redPacket.filter(item=>{
          return item.is_expired == 0
        })
        //金额取整
        redPacket2.forEach(function(item,index,arr){
         item.condition= Math.floor(item.condition)
          item.money = Math.floor(item.money)   
        })
        that.setData({
          redPacket: redPacket2
        })
      }
    });
    //优惠券HTTP
    wx.request({
      url: app.globalData.url + 'userapi/coupon/index',
      data: {
        uid: app.globalData.userId 
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({//加载完后停止loading
          isOk: true
        })
        var couponList=res.data.data
        //that.change(couponList);
        //删除过期的优惠券
         let nowTimeStamp1=that.data.nowTimeStamp;
         let _arr = [];              
        _arr = couponList.filter(item =>{
          item.money =parseInt(item.money);         
          return nowTimeStamp<item.end_stamp;
        })
        that.setData({
          couponList: _arr
        })
      }
    })
  },

  /** 
   * 顶部TAB点击 
   */
  tableTap: function(e) {
    this.setData({
      currentTabId: e.target.id,
      currentTabSwiperIndex: e.target.dataset.index
    });
  },
  /** 
   * 列表区域滑动 
   */
  onSwiper: function(e) {
    var currentIndex = e.detail.current;
    this.setData({
      currentTabId: this.data.topTable[currentIndex].id
    });
    if (currentIndex > this.data.topTable.length / 2) {
      this.setData({
        scrollLeft: this.data.scrollLeft + 150
      });
    } else {
      this.setData({
        scrollLeft: 0
      });
    }
  },
  getRedpack(event){//领取红包
    let redPacket=this.data.redPacket
    console.log(event)
    let id=event.target.id
    let that=this
    // this.setData({
    //   redSta:1
    // })
    wx.request({
      url: app.globalData.url+'/userapi/red_packet/take',
      data:{
        uid:app.globalData.userId,
        system_red_packet_id:id
      },
      method:"GET",
      success:(res)=>{
        console.log(res)
        let code=res.data.status.code
        if(code==200){
          redPacket.forEach(function(item,index,arr){
              if(item.id==id){
                item.user_had=id
              }
          })
          that.setData({
            redPacket
          })
        }
      }
    })
  },
  goShop(event){//去使用红包
    let shopId=event.target.id
    if(shopId==1){
      wx.navigateTo({
        url:'/home/business/index?id=' + shopId,
      })
    }else{
      wx.switchTab({
        url: '/home/home_page/index',
      })
    }
  }
})