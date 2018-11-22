var app = getApp();
var com = require("../../common.js");
const Amap = require('../../map/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      map:"请选择地址",
      notice:'',
      sex:1,
      lable:2,
      phone:'',
      address:'',
      building_card:'',
      name:'',
      jd:'',
      wd:'',
      sh:'',
      shi:'',
      q:''
  },
  //选取地址
  chooseLocation: function (e) {
    let that=this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res);
        console.log(res)
        console.log(res.address)
        let longitude=res.longitude;
        let latitude = res.latitude;
        //经纬度逆解析获得省市
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude,
          data: {
            key:'U2FBZ-E7NKF-3VRJT-NKCRO-FPSSE-BEBWI'
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {            
            console.log(res);
            let shen=res.data.result.address_component.province;
            let shi=res.data.result.address_component.city;
            let qu=res.data.result.address_component.district;
            //console.log(shen,shi,qu)
            that.setData({
              sh:shen,
              shi:shi,
              q:qu
            })
          },
          fail:function() {
           console.log("经纬度获取失败")
          }

        })

        that.setData({
          address: res.name,
          jd:longitude,
          wd:latitude
        })
      },
      fail:function(){
        console.log("选取地址失败"+e)
      }

    })

  },
  //提交数据
  saver(){
    let that=this;
    console.log(that.data.name,that.data.sex, that.data.phone, that.data.address, that.data.building_card, that.data.lable, that.data.jd, that.data.wd, that.data.sh, that.data.shi, that.data.q)
    com.sentHttpRequestToServer(
      '/userapi/address/addressAddMe.html',
      {
        //id:1,
        name:that.data.name,
        sex: that.data.sex,
        phone:that.data.phone,
        address:that.data.address,
        building_card:that.data.building_card,
        label:that.data.lable,
        jd:that.data.jd,
        wd:that.data.wd,
        sh:that.data.sh,
        shi:that.data.shi,
        q:that.data.q
      },
      'POST',
      function (res) {
       	console.log('fg');
        console.log(res)
        console.log(res.data.status.message);
        if (res.data.status.code!=200){
          wx.showToast({
            title: res.data.status.message,
          })
        }else if(res.data.status.code==500){//服务器出错！
          wx.showToast({
            title: '服务器忙',
            icon:'loading'
          })
        }else{
          wx.showToast({
            title: res.data.status.message,
            icon:"success"
          })
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },1000)
        }
      },
      function(res){
        console.log('保存失败'+res)
      }
    );
    // wx.request({
    //   url: 'http://192.168.1.219/userapi/address/addressAddMe.html',
    //   data:{
    //     id:1,
    //     name:that.data.name,
    //     sex: that.data.sex,
    //     phone:that.data.phone,
    //     address:that.data.address,
    //     building_card:that.data.building_card,
    //     label:that.data.lable,
    //     jd:that.data.jd,
    //     wd:that.data.wd,
    //     sh:that.data.sh,
    //     shi:that.data.shi,
    //     q:that.data.q
    //   },
    //   method:'POST',
    //   success:function(res){
    //     console.log('fg');
    //     console.log(res)
    //     console.log(res.data.status.message);
    //     if (res.data.status.code!=200){
    //       wx.showToast({
    //         title: res.data.status.message,
    //         image: '/image/banla_close.png'
    //       })
    //     }else if(res.data.status.code==500){//服务器出错！
    //       wx.showToast({
    //         title: '服务器忙',
    //         icon:'loading'
    //       })
    //     }else{
    //       wx.showToast({
    //         title: res.data.status.message,
    //         icon:"success"
    //       })
    //     }
        
    //     // that.setData({
    //     //   notice:res.data.status.message
    //     // })
    //   },fail:function(err){
    //     console.log('保存失败'+err)
    //   }
      
    // })
   
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        color1:"#f6ebeb",
        border1:"1px solid #fad2d2",
        color2:"#f5f5f5",
        border2:"1px solid #e6e6e6",
        la_color1: "#f6ebeb",
        la_border1: "1px solid #fad2d2",
        la_color2: "#f5f5f5",
        la_border2: "1px solid #e6e6e6",
        la_color3: "#f5f5f5",
        la_border3: "1px solid #e6e6e6"
      })
      const imgUrl= getApp().globalData.imgUrl;
      const isIphoneX = getApp().globalData.isIphoneX;
      this.setData({
        imgUrl:imgUrl,
        isIphoneX:isIphoneX
      })
  },
  sex1:function(e){
    this.setData({
      color1: "#f6ebeb",
      border1: "1px solid #fad2d2",
      color2: "#f5f5f5",
      border2: "1px solid #e6e6e6",
      sex:1
    })
  },
  sex2: function (e) {
    this.setData({
      color2: "#f6ebeb",
      border2: "1px solid #fad2d2",
      color1: "#f5f5f5",
      border1: "1px solid #e6e6e6",
      sex:2
    })
  },
  Label1: function (e) {
    this.setData({
      la_color1: "#f6ebeb",
      la_border1: "1px solid #fad2d2",
      la_color2: "#f5f5f5",
      la_border2: "1px solid #e6e6e6",
      la_color3: "#f5f5f5",
      la_border3: "1px solid #e6e6e6",
      lable:2
    })
  },
  Label2: function (e) {
    this.setData({
      la_color2: "#f6ebeb",
      la_border2: "1px solid #fad2d2",
      la_color1: "#f5f5f5",
      la_border1: "1px solid #e6e6e6",
      la_color3: "#f5f5f5",
      la_border3: "1px solid #e6e6e6",
      lable:1
    })
  },
  Label3: function (e) {
    this.setData({
      la_color3: "#f6ebeb",
      la_border3: "1px solid #fad2d2",
      la_color1: "#f5f5f5",
      la_border1: "1px solid #e6e6e6",
      la_color2: "#f5f5f5",
      la_border2: "1px solid #e6e6e6",
      lable:3
    })
  },
  //姓名输入监听
  set_name(event){
    let that=this;
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
      building_card:event.detail.value
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