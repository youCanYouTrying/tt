
Page({
  data: {
    listTab: [
      { "code": "01", "text": "全部" },
      { "code": "02", "text": "快餐" },
      { "code": "03", "text": "麻辣烫" },
      { "code": "04", "text": "炸鸡" },
      { "code": "05", "text": "西餐" },
      { "code": "06", "text": "西餐" }
    ],
   
    curIndex: 0,
    curText: null,
    scrollLength: 0,
    currentTabId: "01",
    winHeight: 0,
    uhide: 0
  },
  onLoad: function () {
    var that = this;
    this.initData(0),
      wx.getSystemInfo({
        success: function (res) {
          that.setData({ winHeight: res.windowHeight })
        }
      });

    

    var data = {
      
      "datas": [
        {
          "id": 1,
          "imgurl": "../../image/VCG41151586171.jpg",
          "time": "30分钟送达",
          "name": "悦尚豪爵牛排饭、炸鸡、香辣鸡翅、黯然销魂翅",
          "take":"起送价￥15",
          "ibution": "配送费￥3",
          span:[
            {"spanname": "招牌"},
            {"spanname": "镇店"},
            { "spanname": "套餐" },
          ],
          "class":"discoun",
          "jian":"减",
          "jiancon":"满30减5，满60减6，满50减10，",
          "jian_img":"../../image/xianshi.png",
          Discount:[
              {
              "dis_class":"discoun",
              "dis_jian":"减",
              "dis_con": "满30减5，满60减6，满50减10，"
              },
              {
                "dis_class": "song",
                "dis_jian": "送",
                "dis_con": "满100送30优惠券，"
              },
          ]
        },
        {
          "id": 2,
          "imgurl": "../../image/VCG41151586171.jpg",
          "time": "30分钟送达",
          "name": "悦尚豪爵牛排饭、炸鸡、香辣鸡翅、黯然销魂翅",
          "take": "起送价￥15",
          "ibution":"配送费￥3",
          span: [
            { "spanname": "招牌" },
            { "spanname": "镇店" },
          ],
          "class": "song",
          "jian": "送",
          "jiancon": "满100送30优惠券",
          "jian_img": "../../image/xianshi.png",
          Discount: [
            {
              "dis_class": "discoun",
              "dis_jian": "减",
              "dis_con": "满30减5，满60减6，满50减10，"
            },
            {
              "dis_class": "song",
              "dis_jian": "送",
              "dis_con": "满100送30优惠券，"
            },
          ]
        },
        {
          "id": 3,
          "imgurl": "../../image/VCG41151586171.jpg",
          "time": "30分钟送达",
          "name": "悦尚豪爵牛排饭、炸鸡、香辣鸡翅、黯然销魂翅",
          "take": "起送价￥15",
          "ibution": "配送费￥3",
          span: [
            { "spanname": "招牌" },
            { "spanname": "镇店" },
          ],
          "class": "discoun",
          "jian": "减",
          "jiancon": "满30减5，满60减6，满50减10，",
          "jian_img": "../../image/xianshi.png",
          Discount: [
            {
              "dis_class": "discoun",
              "dis_jian": "减",
              "dis_con": "满30减5，满60减6，满50减10，"
            },
            {
              "dis_class": "song",
              "dis_jian": "送",
              "dis_con": "满100送30优惠券，"
            },
            {
              "dis_class": "",
              "dis_jian": "",
              "dis_con": "暂无优惠"
            },
          ]
        }
      ]
    };

      this.setData({
        carInfoData: data.datas,
      })

  },
  //初始化数据
  initData: function (index) {
    var that = this
    this.setData({
      curIndex: index,
      curText: that.data.listTab[index].text,
    })
  },
  //tab点击事件，刷新数据
  reflashData: function (event) {
    var that = this

    var index = event.currentTarget.dataset.index
    //移动滚动条,//200和35是我估算的
    if (index > this.data.curIndex) {
      if (that.data.scrollLength < 200) {
        this.setData({
          scrollLength: that.data.scrollLength + 35 * (index - that.data.curIndex)
        })
      }
    } else {
      if (that.data.scrollLength > 0) {
        this.setData({
          scrollLength: that.data.scrollLength - 35 * (that.data.curIndex - index)

        })
      }
    }
    //移动view位置，改变选中颜色
    this.initData(index)


  },

   //点击切换隐藏和显示
  toggleBtn: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    if (toggleBtnVal == itemId) {
      this.setData({
        uhide: 0
      })
    } else {
      this.setData({
        uhide: itemId
      })
    }
  }
  
})