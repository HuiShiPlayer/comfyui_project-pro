/*同步Ajax*/
$.ajaxSetup({
	async: false
});
/* 0 添加 ；1 修改 */
var operateType = sessionStorage.getItem("type")
var currentApiInfo = null;
if(operateType == 1){
	currentApiInfo = sessionStorage.getItem("api")
}

var main = new Vue({
	el: "#main",
	data: {
		checkModel:"",
		checkdir:"",
		modeldirsShow:false,
		modelDir:"",
		modelDirs:[],
		originData:[],
		models:[],
		originDataModels:[],
		data:{
			type:-1,
			name:"",
			outputsNum:0,
			api:"",
			isDefault:0,
			classType:-1,
			workflowId:"",
			
		},		
		defaultData:"需要配置参数为：prompt（提示词）, seed（种子）, totalSteps（暂时不需要配置）, width（宽）, height（高）",
		startWords:[`function apiFunction(prompt, seed, totalSteps, width, height,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt, seed, totalSteps, width, height,length, blocks_to_swap,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,name,audio1,audio2,audio3,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,name1,name2,audio1,audio2,audio3,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt, seed, totalSteps, width, height,name,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt, seed, totalSteps, width, height,name1,name2,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt, seed, totalSteps, width, height,name1,name2,name3,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,name,video,seed,totalSteps,width,height,length,skip,blocks_to_swap,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,name,video,seed,totalSteps,width,height,length1,skip1,maskP1,length2,skip2,maskP2,blocks_to_swap,referenceAudio1,referenceAudio2,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,seed,referenceAudio1,referenceAudio2,referenceAudio3,param1,param2,param3,param4,param5) {
				var jsondata = `,
			`function apiFunction(prompt,name1,name2,name3,audio1,audio2,audio3,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5) {
				var jsondata = `,
		],
		endWords:`	;return jsondata;
		}`,
		preDatas:{
			"-1":{
				
			},
			"0":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"4":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},
				"name【参考图】":{value:"###{{[[name]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"5":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},
				"name1【参考图1】":{value:"###{{[[name1]]}}###",status:0},
				"name2【参考图2】":{value:"###{{[[name2]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"6":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"name1【参考图1】":{value:"###{{[[name1]]}}###",status:0},
				"name2【参考图2】":{value:"###{{[[name2]]}}###",status:0},
				"name3【参考图3】":{value:"###{{[[name3]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"1":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"length【时长】":{value:"###{{[[length]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"2":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"length【时长】":{value:"###{{[[length]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"name【I2V参考图】":{value:"###{{[[name]]}}###",status:0},
				"audio1【音频1】":{value:"###{{[[audio1]]}}###",status:0},
				"audio2【音频2】":{value:"###{{[[audio2]]}}###",status:0},
				"audio3【音频3】":{value:"###{{[[audio3]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"3":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"length【时长】":{value:"###{{[[length]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"name1【首帧|参考图1】":{value:"###{{[[name1]]}}###",status:0},
				"name2【尾帧|参考图2】":{value:"###{{[[name2]]}}###",status:0},
				"audio1【音频1】":{value:"###{{[[audio1]]}}###",status:0},
				"audio2【音频2】":{value:"###{{[[audio2]]}}###",status:0},
				"audio3【音频3】":{value:"###{{[[audio3]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"7":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},
				"length【时长】":{value:"###{{[[length]]}}###",status:0},
				"skip【跳过帧】":{value:"###{{[[skip]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"name【参考图】":{value:"###{{[[name]]}}###",status:0},
				"video【参考视频】":{value:"###{{[[video]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
				
			},
			"8":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},
				"referenceAudio1【参考音频1】":{value:"###{{[[referenceAudio1]]}}###",status:0},
				"length1【时长1】":{value:"###{{[[length1]]}}###",status:0},
				"skip1【跳过帧1】":{value:"###{{[[skip1]]}}###",status:0},
				"maskP1【遮罩提示词1】":{value:"###{{[[maskP1]]}}###",status:0},
				"referenceAudio2【参考音频2】":{value:"###{{[[referenceAudio2]]}}###",status:0},
				"length2【时长2】":{value:"###{{[[length2]]}}###",status:0},
				"skip2【跳过帧2】":{value:"###{{[[skip2]]}}###",status:0},
				"maskP2【遮罩提示词2】":{value:"###{{[[maskP2]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"name【参考图】":{value:"###{{[[name]]}}###",status:0},
				"video【参考视频】":{value:"###{{[[video]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"9":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},				
				"referenceAudio1【参考音频1】":{value:"###{{[[referenceAudio1]]}}###",status:0},				
				"referenceAudio2【参考音频2】":{value:"###{{[[referenceAudio2]]}}###",status:0},	
				"referenceAudio3【参考音频3】":{value:"###{{[[referenceAudio3]]}}###",status:0},	
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
			"10":{
				"prompt【提示词】":{value:"###{{[[prompt]]}}###",status:0},
				"seed【种子】":{value:"###{{[[seed]]}}###",status:0},
				"width【宽】":{value:"###{{[[width]]}}###",status:0},
				"height【高】":{value:"###{{[[height]]}}###",status:0},	
				"length【时长】":{value:"###{{[[length]]}}###",status:0},
				"blocks_to_swap【块交换】":{value:"###{{[[blocks_to_swap]]}}###",status:0},
				"name1【参考图1】":{value:"###{{[[name1]]}}###",status:0},
				"name2【参考图2】":{value:"###{{[[name2]]}}###",status:0},
				"name3【参考图3】":{value:"###{{[[name3]]}}###",status:0},
				"audio1【音频1】":{value:"###{{[[audio1]]}}###",status:0},
				"audio2【音频2】":{value:"###{{[[audio2]]}}###",status:0},
				"audio3【音频3】":{value:"###{{[[audio3]]}}###",status:0},
				"param1【自定义1】":{value:"###{{[[param1]]}}###",status:0},
				"param2【自定义2】":{value:"###{{[[param2]]}}###",status:0},
				"param3【自定义3】":{value:"###{{[[param3]]}}###",status:0},
				"param4【自定义4】":{value:"###{{[[param4]]}}###",status:0},
				"param5【自定义5】":{value:"###{{[[param5]]}}###",status:0},
			},
		},
		
		
	},
	methods: {
		async copyModel(name){
			var that =this;
			 try {
				// 现代浏览器推荐API：异步复制
				await navigator.clipboard.writeText(name)
				 that.showToast("复制成功")
			  } catch (err) {
				console.error('复制失败：', err)
				// 降级兼容（适配旧浏览器/HTTP环境）
				const isCompatSuccess = copyTextCompat(name)
				if (isCompatSuccess) {
				  that.showToast("复制成功")
				} else {
				 that.showToast("复制失败，请手动复制","error")
				 
				}
			  }
		},
		selectModel(){
			var that = this
			
			var resData =[]
			for(var item of that.originDataModels){
				if(item.search(that.checkModel) !== -1){
					resData.push(item)
				}
			}
			if(resData.length !=0){
				that.models = resData
			}else{
				that.models =that.originDataModels
			}	
		},
		selectDir(){
			var that = this
			
			var resData =[]
			for(var item of that.originData){
				if(item.search(that.checkdir) !== -1){
					resData.push(item)
				}
			}
			if(resData.length !=0){
				that.modelDirs = resData
			}else{
				that.modelDirs =that.originData
			}			
		},
		async getModel(){
			var that =this
			const response =await fetch(app.base_path_contact_comfyui + "/models", {
											method: 'get',
											headers: {
												'Content-Type': 'application/json',
											},
										});
			if (response.ok) {
				const res_data = await response.json();
				that.modelDirs =res_data;
				that.originData = res_data;
				
			}else{
				throw new Error(`获取失败: ${response.status}`);
			}
		},async showModeList(item){
			
			var that = this
			that.modelDir=item;
			const response =await fetch(app.base_path_contact_comfyui + "/models/"+item, {
											method: 'get',
											headers: {
												'Content-Type': 'application/json',
											},
										});
			if (response.ok) {
				const res_data = await response.json();
				that.models =res_data;
				console.log(that.models)
				that.originDataModels = res_data;
				const modelListPanel = document.getElementById('modelListPanel');
				modelListPanel.classList.add('show');
			}else{
				throw new Error(`获取失败: ${response.status}`);
			}
			
		},
		showToast(message, type = 'info') {
		    const toast = document.getElementById('toast');
		    toast.textContent = message;
		    toast.className = 'toast ' + type;
		    toast.style.display = 'block';
		    
		    clearTimeout(toast.timer);
		    toast.timer = setTimeout(() => {
		        toast.style.display = 'none';
		    }, 3000);
		},
		saveApi(){
			var that =this
			if(app.isBlank(that.data.name) ){
				that.showToast("请填写名称")
				return
			}
			if(that.data.classType == -1 ){
				that.showToast("请填写api来源")
				return
			}
			if(that.data.classType != 1 ){
				that.data.workflowId =null
			}
			if(that.data.classType == 1 && app.isBlank(that.data.workflowId)){
				that.showToast("请填写workflowId")
				return
			}
			if(!that.data.outputsNum){
				that.showToast("请填写输出编号")
				return
			}
			if(app.isBlank(that.data.api) ){
				that.showToast("请填写api")
				return
			}
			if( that.data.type == -1){
				that.showToast("请填写类型")
				return
			}
			that.data.startWords = that.startWords[that.data.type]
			that.data.endWords = that.endWords
			
			if(operateType == 0){//走添加ajax
				
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/api/insert",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							$("#cancel").click()							
							that.showToast("操作成功")
						} else {
							that.showToast("操作失败")
						}
						
					}
				});
			}else{//走修改ajax
				$.ajax({
					type: "post",
					url: app.base_path_contact_system + "/api/update",
					data: that.data,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							$("#cancel").click()							
							that.showToast("操作成功")
						} else {
							that.showToast("操作失败")
						}
						
					}
				});
			}
		},
		updateStatus(workflow){
			var curentDataMap = this.preDatas[this.data.type]
			let values = [];
			
			function traverse(current) {
				if (current !== null && typeof current === 'object') {
					Object.keys(current).forEach(key => {
						traverse(current[key]);
					});
				} else {
					values.push(current);
				}
			}
			traverse(workflow);
			for (let [key, value] of Object.entries(curentDataMap)) {
			  if(values.includes(value.value)){
				  value.status =1
			  }else{
				  value.status =0
			  }
			}
		},
		changeStatus(item,status){
			item.status = status
		},updateData(comfyWorkflow){
			var that = this
			that.data.api = JSON.stringify(comfyWorkflow)
			console.log(that.data.api)
			let values = [];
			
			function traverse(current) {
				if (current !== null && typeof current === 'object') {
					Object.keys(current).forEach(key => {
						traverse(current[key]);
					});
				} else {
					values.push(current);
				}
			}		
			traverse(comfyWorkflow);
			var curentDataMap = this.preDatas[this.data.type]
			
			for (let [key, value] of Object.entries(curentDataMap)) {
			  if(values.includes(value.value)){
				  value.status =1
			  }else{
				  value.status =0
			  }
			}
			

		}
	},
})
if(operateType == 1 && currentApiInfo){
	main.data = JSON.parse(currentApiInfo) 
}
