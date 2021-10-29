 //   获取url上的参数
 function GetQueryString(name) {
 	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 	var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
 	if (r != null) return r[2];
 	return null;
 }
 var forum_title = decodeURIComponent(GetQueryString('forum_title'));
 var title = decodeURIComponent(GetQueryString('title'));
 var id = GetQueryString('id');
var vm = new Vue({
 	el: '#app',
 	data: {
 		word: '',
 		host: 'http://bbssc.cloud.hoge.cn/',
 		forum_title: forum_title,
 		title: title,
 		button_flag: false,
 		device_token: undefined,
 		showTips: false,
		content: undefined,
		hasLogin:undefined,
		access_token:undefined,
		storage:window.localStorage,
		tipMessage:''
 	},
 	
 	methods: {
 		inputChage() {
 			if (this.word.length > 0) {
 				this.button_flag = true;
 			} else {
 				this.button_flag = false;
 			}
 			this.$nextTick(function () {
 				this.$refs.changeInput.focus()
			 })
			this._initSystemInfo();
			this._initUserInfo();
 		},
 		// 举报功能  http://cloud.city.hogesoft.com/index.php?m=Apibbs&c=complain&a=addComplain
 		getReport() {
			 const _this = this;
			console.log(this.hasLogin,'hasLogin?')
			 if(!_this.hasLogin){
                SmartCity.goLogin();
                return
            }
 			if (this.word.length > 0) {
 				param = {
 					m: "Apibbs",
 					a: "addComplain",
 					c: "complain",
 					post_id: id,
 					// site_Id: 10188,
 					custom_appid: 462,
 					custom_appkey: 'Qa91EuWbUVAQybDRIBQnmsAR3qC6NIst',
 					// access_token: 'ab47875ec2355ddf24516b94e8037cfe',
					access_token: this.storage.getItem('access_token'),
 					content: _this.word,
 					device_token: _this.device_token,
 					// device_token:"c63767125f5620256532cbea06041885"
 				};
 				config = {
 					headers: {
 						'Content-Type': 'application/json'
 					}
 				}
 				url = _this.host;
 				axios.post(url, param, config)
 					.then(
 						res => {
						       console.log(res.data,'res.data')
 							setTimeout(() => {
 								_this.showTips = false;
 							}, 1500)

 							_this.showTips = true;
 							if (res.data.ErrorCode || res.data.ErrorText) {
								 _this.tipMessage = res.data.ErrorText;
								return
 							}
 							_this.content = '';
							 _this.tipMessage = res.data.success;
							 setTimeout(()=>{
								SmartCity.goBack();
								 },2000)
 						}
 					)
 			} else {
 				return
 			}
 		},

 		// 获取设备信息
 		_initSystemInfo() {
			 const _this = this;
 			SmartCity.getSystemInfo(function (res) {
 				//  res为设备信息  如：device_token等
 				_this.device_token = res.deviceInfo.device_token
 			});
		 },
		_hideTop() {
            SmartCity.hideTopView({
                isShow: 0
            })
        },
		  // 获取用户信息
		  _initUserInfo() {
			const _this = this;
            SmartCity.getUserInfo(function (res) {
                if (res && res.userInfo) {
						_this.access_token = res.userInfo.userTokenKey;
						_this.storage.setItem('access_token',_this.access_token )

					
				}
            })
		},
		goBack() {
			SmartCity.goBack();
		}
        
 	},
 	created() {
	//	new VConsole();
		this._hideTop();
	//	this._initUserInfo();
 		this.inputChage();
		this.hasLogin = new UserInfo().isLogin(this.storage.getItem('access_token'))

 	},
 })
