var app = getApp();

Page({
  data: {
    show:true,
    radio:
    [
      {
        id: 1,
        name: "公司",
      },
      {
        id: 2,
        name: "个人"
      }
    ],
    currentTabId: "table1",
    currentTabSwiperIndex: 0,
    scrollLeft: 0,
    winHeight: 0
  },
  onLoad:function(){
    let t = this;
    let r = t.data.radio;
    let obj = app.globalData.orderObj.obj;
    if(obj.invoice){
      let isShow;
      r.forEach(function (item,index) {
        if (item.id == obj.invoice.type) {
          item.checked = true;
          isShow = index;
        }
      })
      t.setData({
        show:isShow == 1?false:true,
        radio: r,
        inputName: obj.invoice.name || "",
        inputNum: obj.invoice.duty_num || "",
      })
    }else{
      r[1].checked = true;
      t.setData({
        radio: r,
        show: false
      })
    }
  },
  radioClick:function(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.radio;
    let show = this.data.show;
    for (let i = 0; i < item.length; i++){
      item[i].checked = false;
    }
    item[index].checked = true;
    index==0?show=true:show=false;
    this.setData({
      radio: item,
      show:show
    })
  },
  bindKeyInput: function (e) {
    let _str = e.detail.value;
    _str = _str && _str.length > 0 ? _str.replace(/\s+/g, "") : '';  
    this.setData({
      inputName: _str,
    });
  },
  bindNumInput: function (e) {
    let _str = e.detail.value;
    _str = _str && _str.length > 0 ? _str.replace(/\s+/g, ""): '';  
    if(_str.length>20){
      _str = _str.substring(0,20);
      wx.showToast({
        icon:'none',
        title: '请确认税号的长度',
        duration: 1000,
        mask: true
      })
    }
    this.setData({
      inputNum: _str
    });
  },
  submitClick:function(){
    let that = this;
    let t = 1;
    that.data.radio.forEach(function(item){
      if (item.checked){
        t =  item.id;
      }
    })
    if(t == 2){
      that.data.inputNum == null;
    }
    wx.request({
      url: app.globalData.url + 'userapi/order/attach_invoice',
      data: {
        uid:app.globalData.userId,
        shop_id: app.globalData.orderObj.obj.shop.id,
        type: t,  //1公司 2 个人
        name: that.data.inputName,
        duty_num: that.data.inputNum
      },
      method: "POST",
      success: function (res) {
          if(res.data.status.code == 200){
            let str = res.data.data.pre_delivery_time;
            var obj = {
              obj: res.data.data,
              redPackets: res.data.data.user_red_packets,
              coupons: res.data.data.user_coupons,
              pagetime: str
            };
            app.globalData.orderObj = obj;
            wx.navigateBack({
              delta:1
            })
          }else{
            wx.showToast({
              title: res.data.status.message
            })
          }
      },
      fail: function (err) {
        wx.showToast({
          title: '系统错误'
        })
      }
    })
  }
})  