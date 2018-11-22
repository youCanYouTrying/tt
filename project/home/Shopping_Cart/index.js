//获取应用实例
var app = getApp();
Page({
  data: {
    imgUrl: app.globalData.imgUrl,
    hasCart: true,
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    title_disabled: true,//控制修改表头名字
    management_good: false,
    select_all: true,
    total_money: 0,
    totat_price: 0,
    total_box_money: 0,
  },
  onLoad: function () {

    wx.showNavigationBarLoading();
  },
  
  //获取购物车
  getCarList: function () {
    let that = this;

    wx: wx.request({
      url: app.globalData.url + '/userapi/user_cart/getAll',
      data: {
        user_id:app.globalData.userId ,
      },
      method: 'GET',
      success: function (res) {

        if (res.data.status.code == 200) {
          let list = res.data.data;
          if (list && list.length>0){
            list.forEach(item=>{
                item.checked = false;
              if (item.group_items && item.group_items.length>0){
                item.group_items.forEach(li=>{
                  li.checked = false;
                })
              }
            })
            that.setData({
              items:list
            })
          }else{
            that.setData({
              items:[],
              hasCart: false
            })
          }
        }else{
          that.setData({
            items: [],
            hasCart: false
          })
        }
        if (that.data.items.length == 0) {
          that.setData({
            hasCart: false
          })
        }
      },
      fail: function (res) {
        that.setData({
          items:[],
          hasCart:false
        })
       },
      complete: function (res) {
        wx.hideNavigationBarLoading();
      },
    })
  },

  // 编辑
  management: function () {
    let that = this;
    that.select_none();
    that.setData({
      management_good: true,
    })
  },
  //完成
  finish_management: function () {
    let that = this;
    that.getCarList();
    that.setData({
      management_good: false,
    })

  },

  // 二级选择
  select: function (e) {
    let id = e.currentTarget.dataset.id;
    if (!this.data.management_good) {
      wx.navigateTo({
        url: '/home/business/index?id=' + id,
      })

    } else {
      let arr = [];
      let that = this;
      let items = that.data.items;
      let findex = e.currentTarget.dataset.findex;
      let list = items[findex];
      list.checked = !list.checked;
      list.group_items.forEach(function (item) {
        item.checked = list.checked;
      })
      that.setData({
        items: items,
      })
    }

  },
  //三级选择
  childSelect: function (e) {
    let that = this;
    let items = this.data.items;
    let findex = e.currentTarget.dataset.findex;
    let index = e.currentTarget.dataset.index;
    items[findex].group_items[index].checked = !items[findex].group_items[index].checked;
    var arr = [];
    items[findex].group_items.forEach(function (list) {
      list.checked ? arr.push(list) : null;
    })
    arr.length == items[findex].group_items.length ? items[findex].checked = true : items[findex].checked = false;

    that.setData({
      items:items
    })
  },
  // 全选
  select_all: function () {
    let that = this;
    let items = that.data.items;

    items.forEach(function (item) {
      item.checked = true;
      item.group_items.forEach(function (list) {
        list.checked = true;
      })
    })
    that.setData({
      select_all: true,
      items: items
    })
  },
  // 取消全选
  select_none: function () {
    let that = this;
    let items = that.data.items;
    that.setData({
      select_all: false
    })
    items.forEach(function (item) {
      item.checked = false;
      item.group_items.forEach(function (list) {
        list.checked = false;
      })
    })
    that.setData({
      items: items,
    })
  },
  // 删除全部
  deleteitem: function () {

    let that = this;
    let AllList = that.data.items;
    let _arr = [];
    let a1 = [];
    let uparr = [];
    AllList.forEach(item=>{
      if(item.group_items){
        item.group_items.forEach(li=>{
          _arr.push(li)
        })
      }
    })

   a1 = _arr.filter(item=>{
     return item.checked == true;
    })
    if (a1 == false){
      return false
    }
    a1.forEach(item=>{
      let str = item.hash;
      uparr.push(str)
    })
    wx.request({
      url: app.globalData.url + '/userapi/user_cart/delItem',
      method: "POST",
      data: {
        user_id: app.globalData.userId ,
        hash_list: uparr
      },
      success: function (res) {
        if (res.data.status.code == 200) {
          that.getCarList();
          that.select_none();
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
  },
  submit: function (e) {
    let that = this;
    let shopid = e.currentTarget.dataset.shopid;
      wx.navigateTo({
        url: '\/pages/Confirmation_order/index?shopid='+ shopid,
      })
  },
  noCartClick: function () {
    wx.switchTab({
      url: "/home/home_page/index",
    })
  }
  , onShow: function () {
    this.getCarList();
  }
})