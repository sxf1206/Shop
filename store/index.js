import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const hasLogin =uni.getStorageSync("hasLogin") || "";
const unionid = uni.getStorageSync("unionid") || "";
const VIPType = uni.getStorageSync("VIPType") || "";
const Account = uni.getStorageSync("Account") || "";
const User_info = uni.getStorageSync("Userinfo") || {};
const User_Profit = uni.getStorageSync("UserProfit") || {};
const IsShow =uni.getStorageSync("IsShow") || 0; //针对微信的审核用的
const store = new Vuex.Store({
	state: {		
		 loginProvider: "",
		 unionid: unionid,	
         VIPType:VIPType,
		 forcedLogin: false,
		 hasLogin: hasLogin,
		 userName: "",
		 Account:Account,
		 Userinfo:User_info,
		 UserProfit:User_Profit,
		 IsShow:IsShow,
		 },
	mutations: {
		login(state, Account) {
		    state.Account = Account || '新用户';
		    state.hasLogin = true;
			uni.setStorageSync("Account", Account);
			uni.setStorageSync("hasLogin", "true");
		},
		Set_Userinfo(state, Userinfo) {				
			state.Userinfo = Userinfo;
			uni.setStorageSync("Userinfo", Userinfo);
		},
		Get_UserProfit(state, UserProfit) {				
			state.UserProfit = UserProfit;
			uni.setStorageSync("UserProfit", UserProfit);
		},
		logout(state) {
			state.hasLogin = false
			state.unionid = "",
			state.Account = "",
			state.VIPType = 0,
		    uni.setStorageSync("Account", "");
			uni.setStorageSync("VIPType", 0);
		    uni.setStorageSync("hasLogin", false);
		},
		setUnionid(state, unionid) {
			state.unionid = unionid
			uni.setStorageSync("unionid", unionid);
		},setVIPType(state, viptype){
			state.VIPType = viptype
			uni.setStorageSync("VIPType", viptype);
		},
		setIsShow(state, IsShow){
			state.IsShow = IsShow
			uni.setStorageSync("IsShow", IsShow);
		}
	},
	actions: {		
		getUserOpenId: async function ({
			commit,
			state
		}) {
			// return await new Promise((resolve, reject) => {
			// 	if (state.openid) {
			// 		resolve(state.openid)
			// 	} else {
			// 		uni.login({
			// 			success: (data) => {
			// 				commit('login')
			// 				setTimeout(function () { //模拟异步请求服务器获取 openid
			// 					const openid = '123456789'
			// 					console.log('uni.request mock openid[' + openid + ']');
			// 					commit('setOpenid', openid)
			// 					resolve(openid)
			// 				}, 1000)
			// 			},
			// 			fail: (err) => {
			// 				console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
			// 				reject(err)
			// 			}
			// 		})
			// 	}
			// })
		}
	}
})

export default store
