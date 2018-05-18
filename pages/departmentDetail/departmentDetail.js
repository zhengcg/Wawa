var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var wxCharts = require('../../utils/wxcharts.js');
var pieChart = null;
var windowWidth = 320;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: "1",
    id: '',
    mid: '',
    mni_time: '',
    max_time: '',
    title: '',
    page: 1,
    number: 15,
    listHYD: [],
    listYXBG: [],
    listBLJL: [],
    listYYJL: [],
    listYLFY: [],
    listCFD: []


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mid) {
      this.setData({
        id: options.id,
        mid: options.mid,
        mni_time: options.mni_time,
        max_time: options.max_time
      })
    }
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    this.checkToken()

  },
  changeTab: function (e) {
    this.setData({
      tabCur: e.currentTarget.dataset.index,
      page: 1,
      number: 15,
      listHYD: [],
      listYXBG: [],
      listBLJL: [],
      listYYJL: [],
      listYLFY: [],
      listCFD: []
    })
    if (this.data.tabCur == "1") {
      this.getHYD()
    } else if (this.data.tabCur == "2") {
      this.getYXBG()
    } else if (this.data.tabCur == "3") {
      this.getCFD()
    } else if (this.data.tabCur == "4") {
      this.getBLJL()
    } else if (this.data.tabCur == "5") {
      this.getYYJL()
    } else if (this.data.tabCur == "6") {
      this.getYLFY()
    }
  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getHYD()



    } else {
      wx.showModal({
        title: '提示',
        content: '登录过期了，请重新登录！',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../login/login?path=logs'
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  submit: function () {
    var self = this
    wx.redirectTo({
      url: '../department/department?mid=' + self.data.mid + '&mni_time=' + self.data.mni_time + '&max_time=' + self.data.max_time
    })

  },
  previewImg1: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })

  },
  previewImg: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = [];
    var list;
    if (this.data.tabCur == "1") {
      list = this.data.listHYD
    } else if (this.data.tabCur == "2") {
      list = this.data.listYXBG
    } else if (this.data.tabCur == "3") {
      list = this.data.listCFD
    } else if (this.data.tabCur == "4") {
      list = this.data.listBLIL
    }
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        arr = list[i].imgs
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })

  },
  getCFD: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzCf', //仅为示例，并非真实的接口地址
      data: {
        h_son_id: self.data.id,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id: parseInt(self.data.mid),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].imgs = (res.data.data[i].imgs).split(",")
            }
            self.setData({
              page: self.data.page + 1,
              listCFD: self.data.listCFD.concat(res.data.data),
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  getHYD: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzHy', //仅为示例，并非真实的接口地址
      data: {
        h_son_id: self.data.id,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id: parseInt(self.data.mid),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].imgs = (res.data.data[i].imgs).split(",")
            }
            self.setData({
              page: self.data.page + 1,
              listHYD: self.data.listHYD.concat(res.data.data),
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  getYXBG: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzYx', //仅为示例，并非真实的接口地址
      data: {
        h_son_id: self.data.id,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id: parseInt(self.data.mid),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].imgs = (res.data.data[i].imgs).split(",")
            }
            self.setData({
              page: self.data.page + 1,
              listYXBG: self.data.listYXBG.concat(res.data.data),
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  getBLJL: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzBl', //仅为示例，并非真实的接口地址
      data: {
        h_son_id: self.data.id,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id: parseInt(self.data.mid),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].imgs = (res.data.data[i].imgs).split(",")
            }
            self.setData({
              page: self.data.page + 1,
              listBLJL: self.data.listBLJL.concat(res.data.data),
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  getYYJL: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getYy', //仅为示例，并非真实的接口地址
      data: {
        m_id: self.data.mid,
        h_name: self.data.title,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].do_time = res.data.data[i].do_time.slice(0, 10)
            }

            self.setData({
              page: self.data.page + 1,
              listYYJL: self.data.listYYJL.concat(res.data.data)
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
          }
        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  getYLFY: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzFy', //仅为示例，并非真实的接口地址
      data: {
        h_son_id: self.data.id,
        m_id: self.data.mid,
        session_3rd: wx.getStorageSync('token'),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (re) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (re.data.code == 200) {
          var flag = false
          var arr = []

          for (var i = 0; i < re.data.data.length; i++) {
            if (re.data.data[i].data > 0) {
              flag = true
            }
            var obj = {
              name: re.data.data[i].name + "¥ " + parseFloat(re.data.data[i].data),
              data: parseFloat(re.data.data[i].data)
            }
            arr.push(obj)

          }

          if (flag && arr.length == re.data.data.length) {

            pieChart = new wxCharts({
              animation: true,
              canvasId: 'pieCanvas',
              type: 'pie',
              // series: re.data.data,
              series: arr,
              width: windowWidth,
              height: 300,
              dataLabel: true,
            });

          }


        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
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

    if (this.data.tabCur == "1") {
      this.getHYD()
    } else if (this.data.tabCur == "2") {
      this.getYXBG()
    } else if (this.data.tabCur == "3") {
      this.getCFD()
    } else if (this.data.tabCur == "4") {
      this.getBLJL()
    } else if (this.data.tabCur == "5") {
      this.getYYJL()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})