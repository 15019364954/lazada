const http = uni.$u.http;

const to = (promise) => {
	return promise.then(res=>{
		return res;
	}).catch(err => err);
}

export const GetSite = (params) => to(http.post('/api/BaseInfo/GetSite',params));//获取GetSite

export const Login1 = (params) =>  to(http.post('/api/Member/Login1', params));//账号登录

export const RegisterByUserID = (params) =>  to(http.post('/api/Member/RegisterByUserID', params));//账号注册

export const SendMobileAuthCode = (params) =>  to(http.post('/api/Member/SendMobileAuthCode', params));//已绑定手机调用验证码

export const ResetPasswordNoLogin = (params) =>  to(http.post('/api/Member/ResetPasswordNoLogin', params));//重置密码

export const GetMsgNoticeList = (params) =>  to(http.post('/api/BaseInfo/GetMsgNoticeList', params));//获取公告列表

export const GetPPromotionList = (params) =>  to(http.post('/api/BaseInfo/GetPPromotionList', params));//获取优惠活动列表

export const GetPDLevelRuleList = (params) =>  to(http.post('/api/Product/GetPDLevelRuleList', params));//获取优惠活动列表

export const GetMyReport = (params) =>  to(http.post('/api/Product/GetMyReport', params));//获取个人报告

export const GetOrderInfo = (params) =>  to(http.post('/api/Product/GetOrderInfo', params));//获取订单信息

export const GetTeamReport = (params) =>  to(http.post('/api/Product/GetTeamReport', params));//获取团队报告

export const GetTeamMemberReport = (params) =>  to(http.post('/api/Product/GetTeamMemberReport', params));//获取团队报告

export const GetOrderList = (params) => to(http.post('/api/Product/GetOrderList', params)); //获取会员订单列表
	

export const Logout = (params) =>  to(http.post('/api/Member/Logout', params));//用户退出登录

export const OrderConfirm = (params) =>  to(http.post('/api/Product/OrderConfirm', params));//下单确认

export const GetPDRateRuleList = (params) =>  to(http.post('/api/Product/GetPDRateRuleList', params));//获取利息规则列表

export const RateOrder = (params) =>  to(http.post('/api/Product/RateOrder', params));//利息订单下单

export const GetRateOrderList = (params) =>  to(http.post('/api/Product/GetRateOrderList', params));//获取会员利息订单列表

export const CancelRateOrder = (params) =>  to(http.post('/api/Product/CancelRateOrder', params));//利息订单取消

export const GetUserPayDetailsList = (params) =>  to(http.post('/api/Member/GetUserPayDetailsList', params));//获取用户交易记录充值存款

export const GetUserDistillDetailsList = (params) =>  to(http.post('/api/Member/GetUserDistillDetailsList', params));//获取用户交易记录充值存款

export const BindWallet = (params) =>  to(http.post('/api/Member/BindWallet', params));//绑定钱包

export const SendMobileAuthCodeNoBind = (params) =>  to(http.post('/api/Member/SendMobileAuthCodeNoBind', params));//没有绑定手机调用验证码

export const BindMobile = (params) =>  to(http.post('/api/Member/BindMobile', params));//绑定手机号

export const ResetDPassword = (params) =>  to(http.post('/api/Member/ResetDPassword', params));//重置提现密码

export const ResetPassword = (params) =>  to(http.post('/api/Member/ResetPassword', params));//重置密码

export const UserDistill = (params) =>  to(http.post('/api/Member/UserDistill', params));//提现取款

export const UserPay = (params) =>  to(http.post('/api/Member/UserPay', params));//充值存款查询是否存在未支付订单

export const CancelUserPay = (params) =>  to(http.post('/api/Member/CancelUserPay', params));//取消充值订单

export const GetUserPay = (params) =>  to(http.post('/api/Member/GetUserPay', params));//获取充值记录

export const UpdateUserPay = (params,config) =>  to(http.post('/api/Member/UpdateUserPay', params,config));//更新充值存款

export const Upload = (params,config) =>  to(http.post('/api/File/Upload', params));//上传文件

export const GetMemberList = (params) =>  to(http.post('/api/Product/GetMemberList', params));//获取下级会员列表

export const TransferFunds = (params) =>  to(http.post('/api/Product/TransferFunds', params));//代理扶持转账

export const GetUnionFundsList = (params) =>  to(http.post('/api/Product/GetUnionFundsList', params));//获取代理扶持列表

export const GetQRCode = (params) =>  to(http.post('/api/BaseInfo/GetQRCode', params));//获取二维码

export const GetBaseLanguageSet = (params) =>  to(http.post('/api/Language/GetBaseLanguageSet', params));//获取多语言设置

export const GetAppUpgradeList = (params) =>  to(http.post('/api/Common/Region/GetAppUpgradeList', params));//获取更新链接

export const ModifyFaceUrl = (params) =>  to(http.post('/api/Member/ModifyFaceUrl', params));//更新用户头像

export const GetLanguage = (params) =>  to(http.post('/api/BaseInfo/GetLanguage', params));//获取语言列表

export const LoginEmail = (params) =>  to(http.post('/api/Member/LoginEmail',params));//用戶登錄(郵箱)

export const SendEmailAuthCodeNoBind = (params) =>  to(http.post('/api/Member/SendEmailAuthCodeNoBind',params));//发送邮箱验证码无需绑定(郵箱)

export const RegisterByEmail = (params) =>  to(http.post('/api/Member/RegisterByEmail',params));//用户注册(郵箱)

export const RequestRoom = (params) =>  to(http.post('/api/Product/RequestRoom',params));//申请刷单房间

export const GetReferralrewardDetail = (params) =>  to(http.post('/api/Product/GetReferralrewardDetail',params));//获取推荐奖励明细

export const GetOrderCommissionDetail = (params) =>  to(http.post('/api/Product/GetOrderCommissionDetail',params));//获取刷单佣金明细

export const GetTeamCommissionDetail = (params) =>  to(http.post('/api/Product/GetTeamCommissionDetail',params));//获取团队佣金明细

export const RegisterPc = (params) => to(http.post('/api/Member/Register',params)); //用户注册pc

export const CancelOrder = (params) => to(http.post('/api/Product/CancelOrder',params)); //取消订单

export const VerifyMobileAuthCode = (params) => to(http.post('/api/Member/VerifyMobileAuthCode',params)); //验证手机验证码

export const BindName = (params) => to(http.post('/api/Member/BindName',params)); //绑定昵称

export const GetRouletteInfo = (params) => to(http.post('/api/Roulette/GetRouletteInfo',params)); //获取轮盘信息

export const GetRouletteNumber = (params) => to(http.post('/api/Roulette/GetRouletteNumber',params)); //获取抽奖次数

export const Lottery = (params) => to(http.post('/api/Roulette/Lottery',params)); //抽奖

export const GetPrizeDetailList = (params) => to(http.post('/api/Roulette/GetPrizeDetailList',params)); //获取抽奖明细记录

export const GetOrderReport = (params) =>  to(http.post('/api/Product/GetOrderReport', params));//获取抢单个人报告

export const GetValidityDate = (params) =>  to(http.post('/api/Product/GetValidityDate', params));//获取剩余天数时间

export const GetProductList = (params) =>  to(http.post('/api/Product/GetProductList', params));//获取商品列表









