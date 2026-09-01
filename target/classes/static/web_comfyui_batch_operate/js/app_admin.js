/*同步Ajax*/
$.ajaxSetup({
	async: false
});
window.app = {
	SYSTEM_NAME: "绘世玩家ComfyUI管理系统",
	SYSTEM_USERINFO: "userInfo",
	TOKEN: "token",
	
	//开发环境 开始
	base_path_admin_web:'/web_comfyui_batch_operate',
	
	base_path_contact_system:"http://127.0.0.1:6799/admin", 
	//固定comfyui 本地IP
	// netsh winsock reset
	// netsh int ip reset

	base_path_contact_comfyui:"http://127.0.0.1:8188",
	base_path_websocket_comfyui:"ws://127.0.0.1:8188/ws",
	base_app_root_path: "APP_ROOT",
	base_app_page_list: "page_list",
	base_page_id: "page_id",
	RES_OK: 200,
	RES_ERROR: 500,
	RES_NEED_LOGIN: 401,
	RES_ILLEGAL_ARGUMENT: 403,
	cycleTime:3000,

	/*判断字符串是否未空*/
	isBlank: function(str) {
		if(str){
			return false;
		}else{
			return true
		}
		if(str == 0 || str == '0') {
			return false;
		}
		if(str == null || str == ''|| str == undefined || str == 'undefined' || str == "" || str == 'null' ||str == "null" || str.length == 0) {
			return true;
		}
		if($.trim(str).length == 0) {
			return true;
		}
		
		return false;
	},getCookie(name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},isEmptyObject(obj) {
		return Object.keys(obj).length === 0;
	}
}



/* 本地版本 */
var cookieValue = app.getCookie('ip');
console.log(cookieValue);

if(app.isBlank(cookieValue)){
	cookieValue = "http://127.0.0.1:6799/admin"
}
$.ajax({
	url: cookieValue + "/config/getAll",
	method: "POST", // 推荐使用 method 替代 type
	data:{},				
	success: function(response){
		if(response.status == 200){			
			var config = response.data		
			app.base_path_admin_web = config[0]["url"]
			app.base_path_contact_system = cookieValue
			app.base_path_contact_comfyui = config[1]["url"]
			app.base_path_websocket_comfyui = config[2]["url"]
		}else{
			console.log("未查到配置信息")
		}
	}
})





