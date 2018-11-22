var app = getApp();
var com = require("../../common.js");
const Amap = require('../../map/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: "请选择地址",
    notice: '',
    sex:null,
    lable: null,
    phone: '',
    address: '',
    building_card: '',
    name: '',
    jd: '',
    wd: '',
    sh: '',
    shi: '',
    q: ''
  },
  //选取地址
  chooseLocation: function (e) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res);
        console.log(res)
        console.log(res.address)
        let longitude = res.longitude;
        let latitude = res.latitude;
        //经纬度逆解析获得省市
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude,
          data: {
            key: 'U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI'
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            let shen = res.data.result.address_component.province;
            let shi = res.data.result.address_component.city;
            let qu = res.data.result.address_component.district;
            //console.log(shen,shi,qu)
            that.setData({
              sh: shen,
              shi: shi,
              q: qu
            })
          },
          fail: function () {
            console.log("经纬度获取失败")
          }

        })

        that.setData({
          address: res.address,
          jd: longitude,
          wd: latitude
        })
      },
      fail: function () {
        console.log("选取地址失败" + e)
      }

    })

  },
  //提交数据
  saver() {
    let that = this;
    console.log(that.data.name, that.data.sex, that.data.phone, that.data.address, that.data.building_card, that.data.lable, that.data.jd, that.data.wd, that.data.sh, that.data.shi, that.data.q)
    wx.request({
      url: app.globalData.url+'/userapi/address/update.html?id='+this.data.addressId,
      data: {
       name: that.data.name,
        sex: that.data.sex,
        phone: that.data.phone,
        address: that.data.address,
        building_card: that.data.building_card,
        label: that.data.lable,
        jd: that.data.jd,
        wd: that.data.wd,
        sh: that.data.sh,
        shi: that.data.shi,
        q: that.data.q
      },
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('fg');
        console.log(res)
        console.log(res.data.status.message);
        if (res.data.status.code != 200) {
          wx.showToast({
            title: res.data.status.message,
          })
        } else if (res.data.status.code == 500) {//服务器出错！
          wx.showToast({
            title: '服务器忙',
            icon: 'loading'
          })
        } else {
          wx.showToast({
            title: res.data.status.message,
            icon: "success"
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }
    })  

    // com.sentHttpRequestToServer(
    //   '/userapi/address/update.html?id='+app.globalData.userId,
    //   {
    //     id:null,
    //     name: that.data.name,
    //     sex: that.data.sex,
    //     phone: that.data.phone,
    //     address: that.data.address,
    //     building_card: that.data.building_card,
    //     label: that.data.lable,
    //     jd: that.data.jd,
    //     wd: that.data.wd,
    //     sh: that.data.sh,
    //     shi: that.data.shi,
    //     q: that.data.q
    //   },
    //   'POST',
    //   function (res) {
    //     console.log('fg');
    //     console.log(res)
    //     console.log(res.data.status.message);
    //     if (res.data.status.code != 200) {
    //       wx.showToast({
    //         title: res.data.status.message,
    //       })
    //     } else if (res.data.status.code == 500) {//服务器出错！
    //       wx.showToast({
    //         title: '服务器忙',
    //         icon: 'loading'
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.status.message,
    //         icon: "success"
    //       })
    //       setTimeout(function () {
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       }, 1000)
    //     }
    //   },
    //   function (res) {
    //     console.log('保存失败' + res)
    //   }
    // );
   


  },
  //初始化数据
  initialization(addressId){
    let that=this
    com.sentHttpRequestToServer(
      '/userapi/address/read.html',
      {
        id:addressId,
      },
      'POST',
      function (res) {
        console.log(res.data.data)
        let sex=res.data.data.sex
        console.log('拿到的',res.data.data.label)
        if(res.data.data.sex=='男'){
          sex=1
        }else{
          sex=2
        }
         that.setData({
           sex:sex,
           lable: res.data.data.label,
           phone: res.data.data.phone,
           address:res.data.data.address,
           building_card: res.data.data.building_card,
           name: res.data.data.name,
           jd:res.data.data.jd,
           wd:res.data.data.wd,
           sh:res.data.data.sheng,
           shi:res.data.data.shi,
           q:res.data.data.qu
         })
      },
      function(res){
        console.log(res)
      }
    );
    return 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialization(options.id);
    console.log('性别',this.data.sex)
    let color1=this.data.sex==1?"#f6ebeb":"#f5f5f5"
    let border1=this.data.sex==1?"#f6ebeb":"#f5f5f5"
    const imgUrl = getApp().globalData.imgUrl;
    const isIphoneX= getApp().globalData.isIphoneX;
    this.setData({
      imgUrl: imgUrl,
      addressId:options.id,
      isIphoneX:isIphoneX
    })
  },
  sex1: function (e) {
    this.setData({      
      sex: 1
    })
  },
  sex2: function (e) {
    this.setData({      
      sex: 2
    })
  },
  Label1: function (e) {
    this.setData({
      lable: 2
    })
  },
  Label2: function (e) {
    this.setData({
      lable: 1
    })
  },
  Label3: function (e) {
    this.setData({
      lable: 3
    })
  },
  //姓名输入监听
  set_name(event) {
    let that = this;
    that.setData({
      name: event.detail.value
    })
  },
  //手机号输入监听
  set_phone(event) {
    let that = this;
    that.setData({
      phone: event.detail.value
    })
  },
  //楼牌号监听
  set_building_card(event) {
    let that = this;
    that.setData({
      building_card: event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})