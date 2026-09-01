/*同步Ajax*/
$.ajaxSetup({
	async: false
});
eval(api);
var main = new Vue({
	el: "#main",
	data: {
		/* rh */
		config8: "default",
		defaultSource: defaultSource,
		workflowId: workflowId,
		apiKey: apiKey,
		currentTime: new Date().getTime(),
		globalPrompt1: null,
		globalPrompt2: null,
		width: 480,
		height: 720,
		length: 2,
		seed: 2025,
		blocks_to_swap: 0,
		/* 分页数据 */
		prompts: [],
		columnIndex: 2,
		excelData: {},
		list: [],

		objectData: {
			prompt: "",
			pre_image: "img/bg_image_1.png",
			image_width: 100,
			image_height: 100,
			isContinue: false
		},

		progress: 0,
		intask: false,

		prompt_id: "",

		outputsNum: outputsNum,
		interval: null,
		// 暂时未使用
		totalSteps: 8,
		isContinue: false,

		type: 1,
		taskName: null,
		recordsName: "",
		record: null,
		records: [],

		/* todo V2 */
		taskTemlepte: null,
		startRowNum: 2,
		apis: [],
		apiName: "",
		api: {},
		apiFunction: apiFunction,

		// 自定义
		param1: -99999,
		param2: -99999,
		param3: -99999,
		param4: -99999,
		param5: -99999,
		capCutName: null,
		firstAndEndLocation: null,
		startIndex: 1,
		
		lengths:[],
		LenghtcolumnIndex:2

	},
	mounted() {
		var data = localStorage.getItem("t2v")
		if (data) {
			data = JSON.parse(data)
			this.globalPrompt1 = data.globalPrompt1
			this.globalPrompt2 = data.globalPrompt2
			this.width = data.width
			this.height = data.height
			this.seed = data.seed
			this.length = data.length
			this.blocks_to_swap = data.blocks_to_swap
			this.param1 = data.param1
			this.param2 = data.param2
			this.param3 = data.param3
			this.param4 = data.param4
			this.param5 = data.param5
			this.list = data.list
			this.startIndex = data.startIndex
			this.isContinue = data.isContinue
		}
		this.getDefaultConfig()
		var that = this;
		if (that.interval) {
			clearInterval(that.interval)
		}
		this.interval = setInterval(() => {
			that.checkTask();
		}, app.cycleTime)

	},
	beforeDestroy() {
		var that = this;
		clearInterval(that.interval)
		console.log("离开文生视频页面")
	},
	watch: {
		/* task5.1 */
		isContinue: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalPrompt1: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		globalPrompt2: {
			handler(newVal) {
				this.saveDataInCache()
			}
		},
		width: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		height: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		seed: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		blocks_to_swap: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		length: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param1: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param2: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param3: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param4: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		param: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		startIndex: {
			handler(newVal) {
				this.saveDataInCache()
			},
		},
		list: {
			handler(newVal) {
				this.saveDataInCache()
			},
			deep: true // 关键
		},
	},
	methods: {
		checkTask() {
			console.log("checkTask t2v")
			var that = this
			var resTaskListStr = localStorage.getItem("resTaskListt2v");
			if (!app.isBlank(resTaskListStr) && JSON.parse(resTaskListStr).length != 0) {

				var resTaskList = JSON.parse(resTaskListStr);
				var resCompleteData = null;
				$.ajax({
					url: app.base_path_contact_system + "/comfyui/checkCompleteTasks",
					method: "POST", // 推荐使用 method 替代 type
					contentType: 'application/json',
					data: resTaskListStr,
					async: true, // 默认就是 true，可以省略
					success: function(response) {
						if (response.status == 200) {
							resCompleteData = response.data
							if (resCompleteData != null) {
								for (var i = 0; i < resCompleteData.length; i++) {
									var item = resCompleteData[i]
									var obj = item.item
									var taskKey = item.taskKey
									var objUrl = item.objUrl
									var taskIndex = item.taskIndex
									// 赋值
									that.list[taskIndex].pre_video = objUrl
									that.list[taskIndex].isContinue = false
									var data = {
										prompt: that.list[taskIndex].prompt,
										type: 0,
										pre_video: objUrl,
										name: that.list[taskIndex].name,
										referenceImage: null
									}

									//上传记录
									that.uploadGenerateRecords(data)
									//数据更新
									const index = resTaskList.indexOf(taskKey);
									if (index !== -1) {
										resTaskList.splice(index, 1);
										resTaskListStr = JSON.stringify(resTaskList);
										localStorage.setItem("resTaskListt2v", resTaskListStr)
									}

								}
							}
						} else {
							console.log("任务查询,无结果")
						}
					}
				})


			} else {
				if (that.isContinue) {
					that.isContinue = false
				}				
				var displayVal = $('#loading').css('display');
				if (displayVal != 'none') {
					setTimeout(function() {$("#cancel-progress").click()}, 1500);
				}
			}

		},
		/* 5.1 */
		showPrompt(item) {
			this.objectData = item
		},
		/* rh */
		updateConfig() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/updateByID",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 8,
					url: that.config8
				},
				success: function(response) {
					if (response.status == 200) {
						alert_success(response.msg)

					} else {
						alert_error("操纵失败")
					}
				}

			})

		},
		/* rh */
		getDefaultConfig: function() {
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/config/selectById",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					id: 8
				},
				success: function(response) {
					if (response.status == 200) {
						that.config8 = response.data.url

					} else {
						alert_warning("未查到配置信息")
					}
				}

			})
		},
		toDigital() {
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: 8
				},
				success: function(response) {
					if (response.status == 200) {} else {
						alert_error("未设置相应的API")
						return
					}
				}
			})
			var datas = []
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].pre_video) {
					datas.push(this.list[i].pre_video)
				}
			}
			var d = {
				list: datas,
				width: this.width,
				height: this.height
			}
			localStorage.setItem("baseVideos", JSON.stringify(d))
			localStorage.removeItem("digital_human")
			window.location.href = app.base_path_admin_web + '/page/admin/index.html#/digital_human'
		},
		clearCache() {
			var resTaskListStr = localStorage.getItem("resTaskListt2v");
			if (!app.isBlank(resTaskListStr) && JSON.parse(resTaskListStr).length != 0) {
				var resTaskList = JSON.parse(resTaskListStr);
				var resCompleteData = null;
				$.ajax({
					url: app.base_path_contact_system + "/comfyui/clearTask",
					method: "POST", // 推荐使用 method 替代 type
					contentType: 'application/json',
					data: JSON.stringify(resTaskList),
					success: function(response) {
						if (response.status == 200) {
							console.log("清除成功")

						} else {
							console.log("清除失败")
						}
					}
				})
			}
			localStorage.removeItem('resTaskListt2v');
			localStorage.removeItem("t2v")
			location.reload()
		},
		saveDataInCache() {
			console.log('数据缓存')
			var data = {
				isContinue: this.isContinue,
				globalPrompt1: this.globalPrompt1,
				globalPrompt2: this.globalPrompt2,
				width: this.width,
				height: this.height,
				seed: this.seed,
				length: this.length,
				blocks_to_swap: this.blocks_to_swap,
				param1: this.param1,
				param2: this.param2,
				param3: this.param3,
				param4: this.param4,
				param5: this.param5,
				list: this.list,
				startIndex: this.startIndex

			}
			localStorage.setItem("t2v", JSON.stringify(data))
		},
		saveFirtAndEnds() {
			var that = this
			if (app.isBlank(that.firstAndEndLocation)) {
				alert_warning("未设置目录名称")
				return
			}
			if (that.list.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var res = []
			for (var i = 0; i < that.list.length; i++) {
				if (that.list[i].pre_video && that.list[i].pre_video != 'img/bg_image_1.png') {
						res.push(that.list[i].pre_video)
				}
							
			}
			if (res.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var params = {
				name: that.firstAndEndLocation,
				datas: res
			};
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/comfyui/saveFirstAndEnds",
				contentType: "application/json", // 必须指定 JSON 格式
				data: JSON.stringify(params),
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						alert_success("导出成功")
						$("#cancel_save_firtAndEnds").click()
					} else {
						alert_error("导出失败")
					}

				}
			});
		},
		saveCapcut() {
			var that = this
			if (app.isBlank(that.capCutName)) {
				alert_warning("未设置模板名称")
				return
			}
			if (that.list.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var res = []
			for (var i = 0; i < that.list.length; i++) {

				if (that.list[i].pre_video && that.list[i].pre_video != 'img/bg_image_1.png') {
					res.push(that.list[i].pre_video)
				}
			}
			if (res.length == 0) {
				alert_warning("未生成任何结果")
				return
			}
			var params = {
				name: that.capCutName,
				datas: res
			};
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/comfyui/saveCapcut",
				contentType: "application/json", // 必须指定 JSON 格式
				data: JSON.stringify(params),
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						alert_success("导出成功")
						$("#exportData").click()
					} else {
						alert_error("导出失败")
					}

				}
			});

		},
		//自定义
		setAdance(item) {
			this.objectData = item
		},
		changeAdancec(index, item) {
			if (index == 1) {
				if (app.isBlank(item.param1)) {
					item.param1 = null;
				}
			} else if (index == 2) {
				if (app.isBlank(item.param2)) {
					item.param2 = null;
				}
			} else if (index == 3) {
				if (app.isBlank(item.param3)) {
					item.param3 = null;
				}
			} else if (index == 4) {
				if (app.isBlank(item.param4)) {
					item.param4 = null;
				}
			} else if (index == 5) {
				if (app.isBlank(item.param5)) {
					item.param5 = null;
				}
			}
		},
		/* todo V2 */
		confirmApi() {
			var that = this
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/update",
				data: that.api,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						console.log("API设置成功")
						// location.reload(true);

					} else {
						console.log("API设置失败")
					}

				}
			});
			$.ajax({
				url: app.base_path_contact_system + "/api/getDefalutApi",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					type: 1
				},
				success: function(response) {
					if (response.status == 200) {
						that.outputsNum = response.data.outputsNum
						that.api = response.data.api
						that.defaultSource = response.data.classType
						that.workflowId = response.data.workflowId
						that.apiKey = response.data.apiKey

						eval(that.api)
						that.apiFunction = apiFunction

					} else {
						alert_error("未查询到模板信息")
					}
				}
			})



		},
		selectApi(item, index) {
			item.isSelect = !item.isSelect
			this.api = item
			this.api.isDefault = 1
			for (var i = 0; i < this.apis.length; i++) {
				if (i != index) {
					this.apis[i].isSelect = false
					this.apis[i].isDefault = 0
				}
			}
		},
		getApi(type, name) {
			var that = this
			var data = {
				type: type,
				classType: that.defaultSource
			}
			if (!app.isBlank(name)) {
				data.name = name
			}
			$.ajax({
				type: "post",
				url: app.base_path_contact_system + "/api/getApi",
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if (res.status == 200) {
						that.apis.splice(0, that.apis.length);
						for (item of res.data) {
							if (item.isDefault == 1) {
								item.isSelect = true
							} else {
								item.isSelect = false
							}


							that.apis.push(item)
						}
					} else {
						that.apis = []
					}

				}
			});


		},
		changeVisiable(item, index) {
			if (item.prompVisiable) {
				item.prompVisiable = false
			} else {
				item.prompVisiable = true
				this.$nextTick(() => {
					//拿到textarea dom
					const ta = this.$refs['textArea' + index][0]
					if (ta) {
						ta.focus()
						//光标移到末尾
						ta.selectionStart = ta.value.length
						ta.selectionEnd = ta.value.length
					}
				})
			}
		},

		changeW() {
			if (isNaN(this.width)) {
				this.width = 480

			}
		},
		changeH() {
			if (isNaN(this.height)) {
				this.height = 720
			}
		},
		changeS() {
			if (isNaN(this.seed)) {
				this.seed = 0

			}
		},
		changeB() {
			if (isNaN(this.blocks_to_swap)) {
				this.blocks_to_swap = 0

			}
		},
		changeL() {
			if (isNaN(this.length)) {
				this.length = 2

			}
		},
		changeSL(item) {
			if (isNaN(item.length)) {
				item.length = null
			}
		},
		changeSW(item) {
			if (isNaN(item.width)) {
				item.width = null
			}
		},
		changeSH(item) {
			if (isNaN(item.height)) {
				item.height = null
			}
		},
		changeSS(item) {
			if (isNaN(item.seed)) {
				item.seed = null
			}
		},
		confirmRecord() {
			var that = this
			if (this.record) {
				var arr = JSON.parse(this.record.taskList);
				that.list.splice(0, that.list.length);
				for (item of arr) {
					item.prompVisiable = false
					that.list.push(item)
				}
			}
		},
		selectRecords(item, index) {
			item.isSelect = !item.isSelect
			this.record = item

			for (var i = 0; i < this.records.length; i++) {
				if (i != index) {
					this.records[i].isSelect = false
				}
			}
			console.log(this.taskTemlepte)
		},
		getRecords() {
			var that = this
			that.taskTemlepte = null
			$.ajax({
				url: app.base_path_contact_system + "/taskRecords/selectByName",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: that.recordsName,
					type: 1
				},
				success: function(response) {
					if (response.status == 200) {
						that.records.splice(0, that.records.length);
						for (item of response.data) {
							item.isSelect = false
							item.prompVisiable = false
							that.records.push(item)
						}



					} else {
						alert_error("未查询到模板信息")
					}
				}

			})
		},
		save_task() {
			var that = this
			if (that.list.length == 0) {
				alert_warning("当前为生成结果")
				return
			}
			if (app.isBlank(that.taskName)) {
				alert_warning("未给任务命名！")
				return
			}
			var infos = []
			for (var item of that.list) {
				if (item.pre_image == 'img/bg_image_1.png') {
					continue
				}
				var data = {
					"taskName": that.taskName,
					"clientId": item.clientId,
					"prompt": item.prompt,
					"url": item.pre_video,
					"type": 1
				}
				infos.push(data)
			}
			let num = 0
			$.ajax({
				url: app.base_path_contact_system + "/task/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: JSON.stringify(infos),
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(response) {
					if (response.status == 200) {
						num++
					}
				}

			})

			var records = {
				type: 1,
				taskList: JSON.stringify(that.list),
				taskName: that.taskName
			}


			$.ajax({
				url: app.base_path_contact_system + "/taskRecords/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: JSON.stringify(records),
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(response) {
					if (response.status == 200) {
						num++
					}
				}

			})

			if (num == 2) {
				$("#cancel_save_task").click()
				alert_success("操作成功")
			} else {
				alert_error("操作失败")
			}
		},
		getImgArrayBuffer(url) {
			let _this = this;
			return new Promise((resolve, reject) => {
				//通过请求获取文件blob 二进制格式
				let xmlhttp = new XMLHttpRequest();
				xmlhttp.open("GET", url, true);
				xmlhttp.responseType = "blob";
				xmlhttp.onload = function() {
					if (this.status == 200) {
						resolve(this.response);
					} else {
						reject(this.status);
					}
				}
				xmlhttp.send();
			});
		},
		batchDownloadVideo() {
			let _this = this;
			if (_this.list.length == 0) {
				alert_warning("当前未生成结果")
				return
			}
			for (let item of this.list) {
				if (!item.pre_video) {
					continue
				}
				const promise = _this.getImgArrayBuffer(item.pre_video).then(data => {
					// 下载文件, 并存成ArrayBuffer对象(blob)
					const a = document.createElement('a')
					document.body.appendChild(a)
					a.style.display = 'none'
					// 使用获取到的blob对象创建的url
					const url = window.URL.createObjectURL(data)

					a.href = url
					if (!app.isBlank(item.prompt)) {
						a.download = `${item.prompt}.mp4`
					} else {
						var name = item.pre_video.split('/').pop().split('?')[0];
						a.download = name
					}


					a.click()
					document.body.removeChild(a)
					// 移除blob对象的url
					window.URL.revokeObjectURL(url)
				});

			}
		},

		async batchGenerate() {
			if (this.isContinue) {
				alert_warning("有任务生成中!")
				return
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].isContinue) {
					alert_warning("有任务生成中!")
					return
				}
			}
			$("#batchLoading").click()
			this.isContinue = true
			this.progress = 0
			var startNum = 1;
			var endNum = this.list.length
			try {
			 if(isNaN(this.startIndex)){
			 	startNum=this.startIndex.split('-')[0]
				endNum = this.startIndex.split('-')[1]
				 if(isNaN(startNum)){
					 startNum = 1;
				 }
				 if(isNaN(endNum)){
				 	 endNum = this.list.length;
				 }
			 }
			} catch (err) {
			  alert_error("起止编号设置有误")
			}
			
			
			if (isNaN(startNum) || startNum <= 1) {
				startNum = 1
			}

			if (startNum >= this.list.length) {
				startNum = this.list.length
			}
			
			if (isNaN(endNum) || endNum < startNum) {
				endNum = startNum
			}
			
			if (endNum >= this.list.length) {
				endNum = this.list.length
			}
			

			/* task5.1 */
			for (var i = startNum - 1; i < endNum; i++) {
				console.log(endNum)				
				await this.generateImage(this.list[i], 1, i)

			}
			this.isContinue = true
		},
		async cancelTask() {
			this.isContinue = false
			const response = await fetch(app.base_path_contact_system + "/comfyui/interrupt", {
				method: 'post'
			});
			if (response.ok) {
				clearInterval(this.interval);
				alert_success("取消成功！")

			} else {
				throw new Error(`取消失败: ${response.status}`);
			}
			$("#cancel-progress").click()
			this.resetProgress()
		},
		deleteItem(item, index) {
			var canRemove = true
			if (this.isContinue) {
				canRemove = false
				alert_warning("有任务生成中!")
				return
			}
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].isContinue) {
					alert_warning("有任务生成中!")
					canRemove = false
					return
				}
			}
			if (canRemove) {
				/* 重数组中删除数据 */
				this.list.splice(index, 1);
			}
		},
		editPrompt(data, type) {
			var that = this
			that.type = type
			if (type == 1) {
				that.objectData = data
			} else {
				that.objectData = {
					prompt: "",
					pre_image: "img/bg_image_1.png",
					image_width: 100,
					image_height: 100,
					prompVisiable: false,
					pre_video: null,
					isContinue: false
				}
				that.list.push(that.objectData)
			}


		},
		addPrompt() {
			if (this.type == 0) {
				this.list.push(this.objectData)
			}
		},
		/* rh */
		upload2RH(name) {
			var filename = null
			var that = this
			$.ajax({
				url: app.base_path_contact_system + "/comfyui/upload2RH",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name: name,
					apiKey: that.apiKey
				},

				success: function(response) {
					if (response.status == 200) {
						res = JSON.parse(response.data)
						filename = res.data.fileName
					} else {
						alert_warning(response.msg)
					}
				}

			})
			return filename
		},
		async generateImage(data, isbatch, taskIndex) {
			try {
				var that = this
				var response = null
				var res_data = null
				data.isContinue = true
				if (that.defaultSource == 1) {
					response = await fetch(app.base_path_contact_system + "/comfyui/rhprompt", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							"nodeInfoList": that.generateWorkFlow(data),
							"workflowId": that.workflowId,
							"apiKey": that.apiKey,
							"taskIndex": taskIndex,
							"outputsNum": that.outputsNum
						}),
					});

					if (!response.ok) {
						console.log(`HTTP错误: ${response.status}`);
						data.isContinue = false
						return
					}
				} else if (that.defaultSource == 0 || that.defaultSource == 2) {
					response = await fetch(app.base_path_contact_system + "/comfyui/prompt", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							prompt: that.generateWorkFlow(data),
							"taskIndex": taskIndex,
							"outputsNum": that.outputsNum
						}),
					});

					if (!response.ok) {
						console.log(`HTTP错误: ${response.status}`);
						data.isContinue = false
						return
					}

				}


				response = await response.json();
				console.log(response)
				var taskKey = response.data

				console.log("taskKey:" + taskKey)
				if (app.isBlank(taskKey)) {
					data.isContinue = false					
					alert_error("非法参考")
					return
				}

				var resTaskListStr = localStorage.getItem("resTaskListt2v");
				var resTaskList = null;
				if (app.isBlank(resTaskListStr) || JSON.parse(resTaskListStr).length == 0) {
					resTaskList = [];
				} else {
					resTaskList = JSON.parse(resTaskListStr);
				}
				resTaskList.push(taskKey);
				resTaskListStr = JSON.stringify(resTaskList);
				localStorage.setItem("resTaskListt2v", resTaskListStr)
			} catch (error) {
				console.error('生成图片出错:', error);
				alert_error(`生成失败`);

			}
		},
		uploadGenerateRecords(data) {
			$.ajax({
				url: app.base_path_contact_system + "/generateRecords/insert",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					prompt: data.prompt,
					type: 1,
					url: data.pre_video,
					name: data.name,
					reference: null
				},

				success: function(response) {
					if (response.status == 200) {
						console.log("上传成功")
					} else {
						console.log("上传失败")
					}
				}

			})
		},
		async uploadFile2admin(fileUrl, ileName) {
			//todo test
			const response = await fetch(app.base_path_contact_system + "/downloadFileByurl", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fileUrl: fileUrl,
					fileName: ileName
				}),
			});
			// const response = await fetch(app.base_path_contact_system+`/downloadFileByurl?fileUrl=${fileUrl}&fileName=${ileName}`);
			if (!response.ok) {
				throw new Error(`获取进度失败: ${response.status}`);
			}

			const res = await response.json();
			if (res.status == 200) {
				return res.data
			} else {
				throw new Error(`获取进度失败: ${response.msg}`);
			}
		},
		setProgress(num) {
			this.progress = num
		},
		resetProgress() {
			this.progress = 0

		},
		generateRandomNumber() {
			var that = this
			var randomNum = '';
			for (var i = 0; i < 10; i++) {
				randomNum += Math.floor(Math.random() * 10);
			}
			that.seed = randomNum;
		},
		getData(e) {
			var that = this
			var file = e.target.files[0]; // 获取文件对象
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				var workbook = XLSX.read(data, {
					type: 'binary'
				});
				var firstSheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
				var worksheet = workbook.Sheets[firstSheetName]; // 获取工作表数据
				that.excelData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1
				}); // 将工作表转换为JSON数组，header: 1表示第一行为标题行

			};
			reader.readAsBinaryString(file); // 以二进制字符串形式读取文件内容
		},
		changeCulumData(item) {
			var that = this
			if(isNaN(that.columnIndex)||isNaN(that.LenghtcolumnIndex)||isNaN(that.startRowNum)){
				alert_warning("非法参数")
				return
			}
			
			that.prompts = []
			if (item == 0) {
				that.list = []
			}
			// todo V2
			that.prompts = that.excelData.map(row => row[that.columnIndex - 1]).slice(that.startRowNum - 1);
			that.lengths = that.excelData.map(row => row[that.LenghtcolumnIndex - 1]).slice(that.startRowNum - 1);
			for (var i = 0; i < that.prompts.length; i++) {
				var data = {
					prompt: that.prompts[i],
					pre_image: "img/bg_image_1.png",
					image_width: 100,
					image_height: 100,
					pre_video: null,
					prompVisiable: false,
					isContinue: false
				}
				if(!isNaN(that.lengths[i])){
					data.length = that.lengths[i]
				}
				// 对每个元素执行操作
				that.list.push(data)
			}
		},
		validAdvace(data) {
			if (app.isBlank(data.param1)) {
				data.param1 = this.param1
			}
			if (app.isBlank(data.param2)) {
				data.param2 = this.param2
			}
			if (app.isBlank(data.param3)) {
				data.param3 = this.param3
			}
			if (app.isBlank(data.param4)) {
				data.param4 = this.param4
			}
			if (app.isBlank(data.param5)) {
				data.param5 = this.param5
			}
			data.param1 = this.isStringNumberAndConvertToInt(data.param1)
			data.param2 = this.isStringNumberAndConvertToInt(data.param2)
			data.param3 = this.isStringNumberAndConvertToInt(data.param3)
			data.param4 = this.isStringNumberAndConvertToInt(data.param4)
			data.param5 = this.isStringNumberAndConvertToInt(data.param5)

		},
		isStringNumberAndConvertToInt(str) {
			if (!isNaN(parseInt(str)) && isFinite(str)) {
				return parseInt(str);
			} else {
				return str; // 或者返回原字符串或抛出错误
			}
		},
		generateWorkFlow(data) {
			var itemPrompt = data.prompt
			if (!app.isBlank(this.globalPrompt2)) {
				itemPrompt = this.globalPrompt2.concat(",", itemPrompt);
			}
			if (!app.isBlank(this.globalPrompt1)) {
				itemPrompt = this.globalPrompt1.concat(",", itemPrompt);
			}

			var length = data.length
			var width = data.width
			var height = data.height
			var seed = data.seed
			var that = this
			var l = null;
			var w = null;
			var h = null;
			var s = null;
			if (length) {
				l = length
			} else {
				l = that.length
			}
			if (width) {
				w = width
			} else {
				w = that.width
			}
			if (height) {
				h = height
			} else {
				h = that.height
			}
			if (seed) {
				s = seed
			} else {
				s = that.seed
			}
			console.log(`时长为：${l}`)
			// var newapi = api.replace(/\\/g, "\\\\");
			/* todo V2 */
			that.validAdvace(data)
			var jsondata = that.apiFunction(itemPrompt, s, that.totalSteps, w, h, l, that.blocks_to_swap, data
				.param1, data.param2, data.param3, data.param4, data.param5)
			return jsondata
		},
		previewImage(url) {
			window.open(url, '_blank');
		},
		changeInput(item) {

		}

	}
})

/*页码渲染*/
