var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    "code": "",
    "nickName": "",
    "gender": "",
    "avatarUrl": "",
    "province": "",
    "city": "",
    "county": "",
    path: "../index/index",
    paths: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    if (options.path) {
      this.setData({
        paths: "../" + options.path + "/" + options.path
      })
    }
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              _this.setData({
                "nickName": res.userInfo.nickName,
                "gender": res.userInfo.gender,
                "avatarUrl": res.userInfo.avatarUrl,
                "province": res.userInfo.province,
                "city": res.userInfo.city,
                "county": res.userInfo.country

              })
                           
              
            }
          })
        }
      }
    })
    
    // this.checkToken();
  },
  bindGetUserInfo: function (e) {
    var _this=this;
    _this.setData({
      "nickName": e.detail.userInfo.nickName,
      "gender": e.detail.userInfo.gender,
      "avatarUrl": e.detail.userInfo.avatarUrl,
      "province": e.detail.userInfo.province,
      "city": e.detail.userInfo.city,
      "county": e.detail.userInfo.country

    })
    _this.registerFn()
  },
  checkToken: function () {
    var _this = this;
    wx.checkSession({
      success: function () {
         _this.registerFn()
        if (!wx.getStorageSync('token')) {
          _this.registerFn()
        } else {
          wx.switchTab({
            url: _this.data.path
          })

        }

      },
      fail: function () {
        // _this.bindGetUserInfo()
      }
    })

  },
  registerFn: function () {
    var _this = this;
    try {
      wx.showLoading({
        title: '请求登录中',
      })
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          _this.setData({
            code:res.code
          })
          _this.sendLogin()

        } else {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }

          wx.showToast({
            title: '调微信登录接口失败！',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });
  },
  sendLogin: function () {
    //发起网络请求
    var _this = this;
    var url = api + 'Usermp/login';
    wx.request({
      url: url,
      method: 'POST',
      header: header,
      data: {
        "code": _this.data.code,
        "nickName": _this.data.nickName,
        "gender": _this.data.gender,
        "avatarUrl": _this.data.avatarUrl,
        "province": _this.data.province,
        "city": _this.data.city,
        "county": _this.data.county

      },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          wx.setStorageSync('token', res.data.data.session_3rd);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              if (wx.getStorageSync('token')) {
                if (_this.data.paths) {
                  if (_this.data.paths == "../logs/logs" || _this.data.paths == "../me/me") {
                    wx.switchTab({
                      url: _this.data.paths
                    })

                  } else {
                    wx.redirectTo({
                      url: _this.data.paths
                    })
                  }

                } else {
                  wx.switchTab({
                    url: _this.data.path
                  })

                }

              }

            }

          })


        } else {
          wx.showToast({
            title: "登陆失败",
            duration: 2000
          })

        }
      },
      fail: function () {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        wx.showToast({
          title: '接口调用失败！',
          icon: 'fail',
          duration: 2000
        })
      }
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