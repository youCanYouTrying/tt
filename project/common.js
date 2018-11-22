var app = getApp();

/**
 * 对字符串判空
 */
function isStringEmpty(data) {
  if (null == data || "" == data) {
    return true;
  }
  return false;
}
/*
*分钟换算时间
*/
function conversionTime (t){
  if(!t) return false;
  var num1 = parseInt(t / 60);
  var num;
  if (t >= 60) {
    num = (t / 60).toFixed(1)
  }else{
    t = parseInt(t);
    return `${t}分钟`
  }
  if (num1 == num) {
    return `${num1}小时`
  }else{
    return `${num}小时`
  }
};
//图片预览
function previewImg (url,arr,str){
  str?str:str = "预览失败"
  wx.previewImage({
    current: url, 
    urls: arr,
    fail:function(){
      wx.showToast({
        title: str,
      })   
    }
  })
};

function youhuiType(arr) {

  arr.forEach(function(item) {
    item.typeClass = 'type' + item.type;
    switch (item.type) {
      case 1: //满减
        item.str =  `满${item.money}元减${item.give_money}元`;
        item.name = '减';
        item.typeColor = '#FB4345';
        break;
      case 2: //折扣
        item.str = `折扣商品${item.give_money}折`;
        item.name = '折';
        item.typeColor = '#C1B3E2';
        break;
      case 3: //减配送费
        item.str = `减配送费${item.give_money}元`;
        item.name = '减';
        item.typeColor = '#681E8F';
        break;
      case 4: //下单反券
        item.str = `实际支付${item.money}元返${item.give_money}元商家代金券`;
        item.name = '返';
        item.typeColor = '#FB4345';
        break;
      case 5: //商家优惠券
        item.str = `实际支付${item.money}元返${item.give_money}元商家优惠券`;
        item.name = '券';
        item.typeColor = '#FB4345';
        break;
      case 6: //新客立减
        item.str = `新用户下单立减${item.give_money}元`;
        item.name = '新';
        item.typeColor = '#C184E2';
        break;
      case 7: //分享
        item.str = `分享领取${item.give_money}元红包`;
        item.name = '分';
        item.typeColor = '#FB4345';
        break;
    }
  })
  return arr
}


/**
 * 封装网络请求
 */
function sentHttpRequestToServer(uri, d, method, successCallback, failCallback, completeCallback) {
  const g = app.globalData;
  const glod = {
    id: g.userId,
  };
  let data = Object.assign(glod, d);
  wx.request({
    url: g.url + uri,
    data: data,
    method: method,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  })
}

function changeSheng(sheng) {
  if (sheng == "重庆市" || sheng == "北京市" || sheng == "上海市" || sheng == "天津市") {
    sheng = sheng.substring(0, 2)
  }
  return sheng
}

/**
 * 将map对象转换为json字符串
 */
function mapToJson(map) {
  if (null == map) {
    return null;
  }
  var jsonString = "{";
  for (var key in map) {
    jsonString = jsonString + key + ":" + map[key] + ",";
  }
  if ("," == jsonString.charAt(jsonString.length - 1)) {
    jsonString = jsonString.substring(0, jsonString.length - 1);
  }
  jsonString += "}";
  return jsonString;
}

/**
 * 弹窗提示成功
 */
function toastSuccess() {
  wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
}
/**
 * 获取当前时间戳
 */
function getCurrentTimeStamp() {
  var timestamp = Date.parse(new Date());
  return timestamp/1000;
}

function pageTitle(str) {
  str = str.length > 15 ? str.substring(0, 15) + '...' : str;
  wx.setNavigationBarTitle({
    title: str //页面标题为路由参数
  })
}
/**
 * 时间戳日期格式
 */
function formatDateTime(timeStamp,isDate) {
  var date = new Date();
  date.setTime(timeStamp * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  if(isDate){
    return y + '-' + m + '-' + d
  }
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
/**
 * 时间戳转 h-m
 */
function formHour(timeStamp){
  var date = new Date(timeStamp * 1000);
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute =date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return `${h}:${minute}`
}

//弹出框居中显示

function modelMiddle(Dom,that){
  // wx:if 没有显示出来 是读取不到元素的信息的 
  let query = wx.createSelectorQuery(),
  sH =app.globalData.getSystemInfo.windowHeight,
  DomH,top;
  query.select(Dom).boundingClientRect();
  query.exec((res) => {
    if(res[0]){
      DomH = res[0].height;
      top = (sH / 2) - (DomH / 2)-50;
      that.setData({
        modalTop: top,
      });
    }
  })
}

function getUsername(callback){
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.request({
        url: app.globalData.url + 'userapi/user/get_opendid_form_wexin',
        data: {
          code: res.code
        },
        method: "POST",
        success: function (res) {
          let openid = res.data.data.openid; //返回openid
          app.globalData.session_key = res.data.data.session_key;
          app.globalData.openid = openid;

          wx.request({
            url: app.globalData.url + 'userapi/user/userInfoSmall',
            data: {
              wx_oppenid: app.globalData.openid,
              nickname: app.globalData.userInfo.nickName,
              head_img: app.globalData.userInfo.avatarUrl
            },
            method: "POST",
            success: function (res) {
              app.globalData.userId = res.data.data.id;
              app.globalData.userPhone = res.data.data.phone;
              callback;
              console.log('我不管我进来了',app.globalData.userId)
            }
          })
        }
      })
    }
  })
}

module.exports = {
  youhuiType: youhuiType,
  conversionTime:conversionTime,
  isStringEmpty: isStringEmpty,
  sentHttpRequestToServer: sentHttpRequestToServer,
  mapToJson: mapToJson,
  toastSuccess: toastSuccess,
  pageTitle: pageTitle,
  changeSheng: changeSheng,
  formatDateTime: formatDateTime,
  previewImg:previewImg,
  getCurrentTimeStamp:getCurrentTimeStamp,
  formHour:formHour,
  modelMiddle: modelMiddle,
  getUsername: getUsername
}