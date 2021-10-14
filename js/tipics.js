 // 获取url上的参数
 function GetQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
     if (r != null) return unescape(r[2]);
     return null;
 }
 // 获取url的参数ID
 var fid = GetQueryString("id");
 var vm = new Vue({
     el: '#app',
     data: {
         host: 'http://bbssc.cloud.hoge.cn/',
         sortsList: [],
         forum_id: null,
         cityTipicList: [],
         allCityTipicList: [],
         curIndex: 0,
         parent_forum: null,
         access_token: undefined,
         hasLogin: undefined,
         storage: window.localStorage,
         url: 'http://mapi.kangbatv.com/h5/kb_app'
     },
     methods: {
         // 分类列表 sortsList   ?m=Apibbs&c=post&a=postList  
         getSortData() {
             const _this = this;
             param = {
                 m: "Apibbs",
                 a: "index",
                 c: "forum",
                 fid: 0,
                 except_weight: 90,
                 // is_activity:1,
                 //  site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371'
                 access_token: _this.storage.getItem('access_token')
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         _this.sortsList = res.data;
                         console.log(res.data, '分类列表');
                         _this.getSecondData(0, res.data[0].id)
                     }
                 )
         },

         // 获取二级分类的数据
         getSecondData(index, id) {
             const _this = this;
             _this.curIndex = index;
             // _this.getCityTipic();
             _this.getCityTipic(index, id)
         },
         // 所有的话题列表 【新增】
         getAllCityTipic() {
             const _this = this;
             param = {
                 m: "Apibbs",
                 c: "forum",
                 a: "index",
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         res.data.forEach((ele) => {
                             //   ele.indexpic.filename = _this.imgAdaptation(ele.indexpic.filename, '114', '114')
                         })
                         _this.allCityTipicList = res.data
                     }
                 )

         },
         getCityTipic(index, id) {
             // ?m=Apibbs&c=forum&a=index  话题列表
             const _this = this;
             param = {
                 m: "Apibbs",
                 c: "forum",
                 a: "index",
                 fid: id,
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 //  site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         console.log(res.data, '话题列表')
                         if (res.data.ErrorCode || res.data.ErrorText) {
                             return
                         }
                         res.data.forEach((ele) => {
                             ele.indexpic.filename = _this.imgAdaptation(ele.indexpic.filename, '114', '114')
                         })
                         _this.cityTipicList = res.data

                     }
                 )

         },


         // 添加关注 
         getFollowed(index, id) {
             event.preventDefault();
             if (!this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             this.followData(index, id)
         },
         // 添加关注
         getFollowedAll(index, id) {
             event.preventDefault();
             if (!this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             this.followDataAll(index, id)
         },
         // 取消关注   base_url?m=Apibbs&c=care&a=deleteCare
         deleteFollowed(index, id) {
             event.preventDefault();
             if (!this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             this.deleteFollowData(index, id);
         },
         // 取消关注   base_url?m=Apibbs&c=care&a=deleteCare
         deleteFollowedAll(index, id) {
             event.preventDefault();
             if (!this.hasLogin) {
                 console.log('login')
                 SmartCity.goLogin();
                 return
             }
             this.deleteFollowDataAll(index, id);
         },
         followData(index, id) {
             // http://mobilesc.city.hogesoft.com/index.php?__hgActionType=xcs/bbs_care_care.php
             const _this = this;

             // const access_token=_this.getCookie('access_token')
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "care",
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 // 关注帖子1   关注人2
                 care_type: 1,
                 // 被关注的话题id
                 uorf_id: id,
                 // is_second（是否是子集）：1
                 is_second: 1,
                 // site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         console.log(res.data, 'follow');
                         _this.cityTipicList[index].is_care = 1;
                         // _this.sortsList[index].is_care = 1;
                     }
                 )
         },
         followDataAll(index, id) {
             // http://mobilesc.city.hogesoft.com/index.php?__hgActionType=xcs/bbs_care_care.php
             const _this = this;

             // const access_token=_this.getCookie('access_token')
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "care",
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 // 关注帖子1   关注人2
                 care_type: 1,
                 // 被关注的话题id
                 uorf_id: id,
                 // is_second（是否是子集）：1
                 is_second: 1,
                 // site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         console.log(res.data, 'follow');
                         _this.allCityTipicList[index].is_care = 1;
                         // _this.sortsList[index].is_care = 1;
                     }
                 )
         },
         deleteFollowData(index, id) {
             // m=Apibbs&c=care&a=deleteCare
             // http://mobilesc.city.hogesoft.com/index.php?__hgActionType=xcs/bbs_care_care.php
             const _this = this;
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "deleteCare",
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 // 关注帖子1   关注人2
                 care_type: 1,
                 // 被关注的话题id
                 uorf_id: id,
                 // is_second（是否是子集）：1
                 is_second: 1,
                 // site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         console.log(res.data, '不关注了');
                         // _this.sortsList[index].is_care = 0;
                         _this.cityTipicList[index].is_care = 0;
                     }
                 )
         },
         deleteFollowDataAll(index, id) {
             // m=Apibbs&c=care&a=deleteCare
             // http://mobilesc.city.hogesoft.com/index.php?__hgActionType=xcs/bbs_care_care.php
             const _this = this;
             param = {
                 m: "Apibbs",
                 c: "care",
                 a: "deleteCare",
                 // access_token: 'c6fe9702d0c02487a1a6ee46a0ff3371',
                 access_token: _this.storage.getItem('access_token'),
                 // 关注帖子1   关注人2
                 care_type: 1,
                 // 被关注的话题id
                 uorf_id: id,
                 // is_second（是否是子集）：1
                 is_second: 1,
                 // site_Id: 10188,
                 custom_appid: 462,
                 custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst'
             }
             url = _this.host;
             axios.get(url, {
                     params: param
                 })
                 .then(
                     res => {
                         console.log(res.data, '不关注了');
                         // _this.sortsList[index].is_care = 0;
                         _this.allCityTipicList[index].is_care = 0;
                     }
                 )
         },
         // 获取用户信息
         _initUserInfo() {
             var _this = this;
             // _this.storage.setItem('access_token','ab47875ec2355ddf24516b94e8037cfe');
             SmartCity.getUserInfo(function (res) {
                 if (res && res.userInfo) {
                     if (!_this.storage.getItem('access_token')) {
                         _this.storage.setItem('access_token', res.userInfo.userTokenKey)
                     }
                 }
                 _this.getSortData();
             })
         },
         imgAdaptation(filename, w, h) {
             var reg = RegExp(/\{\$hgPicSizeStart\}/);
             if (filename.match(reg)) {
                 filename = filename.replace("{$hgPicSizeStart}", "");
                 filename = filename.replace("{$hgPicSizeEnd}", "");
                 filename = filename.replace("{$hgPicSizeWidth}", w);
                 filename = filename.replace("{$hgPicSizeHeight}", h);
             }
             return filename
         },
         _hideTop() {
             SmartCity.hideTopView({
                 isShow: 0
             })
         },
         goMyFollow() {
             SmartCity.linkTo({
                 innerLink: `${this.url}/myFollow.html`
             });
         },
         goBack() {
             SmartCity.goBack();
         }
     },
     created() {
         // new VConsole();
         this._hideTop();
         this._initUserInfo();
         // this.getSortData();
         this.getAllCityTipic();
         this.hasLogin = new UserInfo().isLogin(this.storage.getItem('access_token'))
         // this.getSecondData(this.curIndex, fid)
     },
 })