/*同步Ajax*/
$.ajaxSetup({
	async: false
});
var outputsNum = null
var api = null
var defaultSource=null
var workflowId =null
var apiKey =null
// 关注输出的数据格式，未测试足够多的工作流，qwen工作流
$.ajax({
	url: app.base_path_contact_system + "/api/getDefalutApi",
	method: "POST", // 推荐使用 method 替代 type
	data: {
		type: 4
	},
	success: function(response) {
		if (response.status == 200) {
			outputsNum = response.data.outputsNum
			api = response.data.api
			defaultSource =response.data.classType
			workflowId=response.data.workflowId
			apiKey=response.data.apiKey
		} else {
			alert_error(response.msg)
		}
	}
})
