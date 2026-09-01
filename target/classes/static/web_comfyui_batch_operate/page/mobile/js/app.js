$.ajaxSetup({
	async: false
});
const { createApp } = Vue;
var uploadTocomfyUIImgs={}
createApp({
    data() {
        return {
			canGoOn:false,
			config8:"default",
			defaultSource: null,
			workflowId: null,
			apiKey: null,
            currentPage: 'record',
            recordTab: 'all',
            imageTab: 'text',
            videoTab: 'text',
			
			showPreviewModal: false,
			previewData: { type: '', url: ''},

            imagePrompt: '',
			imageWith:720,
			imageHeight:1280,
			imageSeed:2026,
			
			imagePrompt1: '',
			imageWith1:720,
			imageHeight1:1280,
			imageSeed1:2026,
			
			imagePrompt2: '',
			imageWith2:720,
			imageHeight2:1280,
			imageSeed2:2026,
			
			imagePrompt3: '',
			imageWith3:720,
			imageHeight3:1280,
			imageSeed3:2026,			
			
            previewImage: '',
			twoP1:"",
			twoP2:"",
			threeP1:"",
			threeP2:"",
			threeP3:"",
			
			
			videoPrompt: '',
			videoWidth:720,
			videoHeight:1280,
			videoSeed:2026,
			longs:81,
			blocks_to_swap:0,
			
			
            previewVideoImg: '',
			videoPrompt1:'',
			videoWidth1:720,
			videoHeight1:1280,
			videoSeed1:2026,
			longs1:81,
			blocks_to_swap1:0,
			
            frameStart: '',
            frameEnd: '',
			videoPrompt2:'',
			videoWidth2:720,
			videoHeight2:1280,
			videoSeed2:2026,
			longs2:81,
			blocks_to_swap2:0,
			
			videoReferenceImage: '',
			previewSourceVideo: '',
			videoPrompt3:'',
			videoWidth3:720,
			videoHeight3:1280,
			videoSeed3:2026,
			longs3:81,
			skip3:0,
			blocks_to_swap3:0,
			

            showSheet: false,
            currentUploadType: '',

            records: [],
            prompts: [
                { title: '唯美风景', content: '唯美星空，高清8K，梦幻光影，蓝色调' },
                { title: '动漫风格', content: '日系动漫，少女，樱花，治愈系，高清' }
            ],
			showEditApi:false,
            showEditModal: false,
            editIndex: -1,
            editForm: { title: '', content: '' },

            toastShow: false,
            toastText: '',
            toastBg: 'rgba(167,139,250,0.9)',
			
			currentTime: new Date().getTime(),
			pageNum:1,
			/* 分页数据 */
			pageSize: 20,
			currentApi:null,
			currentApiType:0,
			apis:[],
			apiFunction:null,
			outputsNum:0,
			prompt_id:null,
			
			promptPageNum:1,
			prompts:[],
			prompt:{},
			promptType:1,
			
			isGenerating:0
        };
    },
    computed: {
        filteredRecords() {
            if (this.recordTab === 'all') return this.records;
            return this.records.filter(item => item.type === this.recordTab);
        }
    },
    mounted() {
        this.search();		
    },
    methods: {
		getResouces(type){
			var that= this
			if(type == 11){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:1,
						prompt:that.imagePrompt1
					},
					success: function(res) {
						if (res.status == 200) {
							that.imagePrompt1 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.previewImage = remoteUrl + res.data.resources[0]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}else if(type == 12){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:2,
						prompt:that.imagePrompt2
					},
					success: function(res) {
						if (res.status == 200) {
							that.imagePrompt2 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.twoP1 = remoteUrl + res.data.resources[0]
							}
							if(res.data.resources && res.data.resources.length>1){
								that.twoP2 = remoteUrl + res.data.resources[1]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}else if(type == 13){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:3,
						prompt:that.imagePrompt3
					},
					success: function(res) {
						if (res.status == 200) {
							that.imagePrompt3 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.threeP1 = remoteUrl + res.data.resources[0]
							}
							if(res.data.resources && res.data.resources.length>1){
								that.threeP2 = remoteUrl + res.data.resources[1]
							}
							if(res.data.resources && res.data.resources.length>2){
								that.threeP3 = remoteUrl + res.data.resources[2]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}else if(type == 21){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:1,
						prompt:that.videoPrompt1
					},
					success: function(res) {
						if (res.status == 200) {
							that.videoPrompt1 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.previewVideoImg = remoteUrl + res.data.resources[0]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}else if(type == 22){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:2,
						prompt:that.videoPrompt2
					},
					success: function(res) {
						if (res.status == 200) {
							that.videoPrompt2 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.frameStart  = remoteUrl + res.data.resources[0]
							}
							if(res.data.resources && res.data.resources.length>1){
								that.frameEnd  = remoteUrl + res.data.resources[1]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}else if(type == 23){
				$.ajax({
					url: remoteUrl + "/comfyui/getResouces",
					method: "POST", // 推荐使用 method 替代 type
					async: true,
					data: {
						count:1,
						prompt:that.videoPrompt3
					},
					success: function(res) {
						if (res.status == 200) {
							that.videoPrompt3 = res.data.prompt
							if(res.data.resources && res.data.resources.length>0){
								that.videoReferenceImage  = remoteUrl + res.data.resources[0]
							}
						} else {	
							that.showToast(res.msg, '#a78bfa');
						}
					}
				})
			}
		},
		setVideoFirstFrame(e){
			console.log("video")
			const video = e.target; 
			// 只跳帧显示，不生成图片，不触发跨域
			    video.currentTime = 0.1;
			    
			    // 显示后立即回到0，不影响播放
			    setTimeout(() => {
			      video.currentTime = 0;
			    }, 100);
		},
		changeImageFunction(type,num){
			this.imageTab = type
			this.currentApiType =num
			this.currentApi =null
			this.apiFunction =null
			var resData = getDefualtApi(num,this.showToast)
			this.canGoOn=resData.canGoOn
			this.defaultSource=resData.defaultSource
			this.workflowId=resData.workflowId
			this.apiKey=resData.apiKey
			
			this.outputsNum=resData.outputsNum
			this.currentApi=resData.api
			eval(resData.api)
			this.apiFunction=apiFunction
		},
		changeVideoFunction(type,num){
			this.videoTab = type
			this.currentApiType =num
			this.currentApi =null
			this.apiFunction =null
			var resData = getDefualtApi(num,this.showToast)
			this.canGoOn=resData.canGoOn
			this.defaultSource=resData.defaultSource
			this.workflowId=resData.workflowId
			this.apiKey=resData.apiKey
			this.outputsNum=resData.outputsNum
			this.currentApi=resData.api
			eval(resData.api)
			this.apiFunction=apiFunction
		},
		selectApi(api,index){
			api.isSelect =true;
			api.isDefault = 1
			this.currentApi =api
			for(var i=0 ;i<this.apis.length;i++){
				if(i!= index){
					this.apis[i].isSelect =false
					this.apis[i].isDefault =0
				}
			}
		},
		changeApi(){
			if(!this.canGoOn){
				this.showToast('未设置API', '#a78bfa');
				return
			}
			this.showEditApi =true
			var type =0;
			if(this.imageTab == 'text'){
				type = 0
			}else if(this.imageTab == 'single'){
				type = 4
			}else if(this.imageTab == 'two'){
				type = 5
			}else if(this.imageTab == 'three'){
				type = 6
			}
			this.currentApiType = type;
			console.log("this.defaultSource:"+this.defaultSource)
			this.apis = getApi(type,this.defaultSource)
			
		},changeVideoApi(){
			if(!this.canGoOn){
				this.showToast('未设置API', '#a78bfa');
				return
			}
			this.showEditApi =true
			var type =0;
			if(this.videoTab == 'text'){
				type = 1
			}else if(this.videoTab == 'img'){
				type = 2
			}else if(this.videoTab == 'frame'){
				type = 3
			}else if(this.videoTab == 'video'){
				type = 7
			}
			this.currentApiType = type;
			this.apis = getApi(type,this.defaultSource)
		},
		openPreview(item) {
		    this.previewData = {
		        type: item.type,
		        url: item.url
		    };
		    this.showPreviewModal = true;
		},
		// 关闭预览
		closePreviewModal() {
		    this.showPreviewModal = false;
		    this.previewData = { type: '', url: ''};
		},
		backToTop() {
		   window.scrollTo({
		           top: 0,
		           behavior: 'smooth'
		       });
		},
        switchPage(page) {
            this.currentPage = page;
			var apiType = 0;
			this.currentApi =null
			this.apiFunction =null
			if(page == 'record'){
				this.showToast('刷新数据', '#a78bfa');
				this.pageNum=1
				this.records=[]
				this.search()
				
			}else if(page == 'image'){
				apiType =0
				this.imageTab = "text"
				this.currentApiType = apiType
				var resData = getDefualtApi(apiType,this.showToast)
				this.canGoOn=resData.canGoOn
				this.defaultSource=resData.defaultSource
				this.workflowId=resData.workflowId
				this.apiKey=resData.apiKey
				this.outputsNum=resData.outputsNum
				this.currentApi=resData.api
				eval(resData.api)
				this.apiFunction=apiFunction
			}else if(page == 'video'){
				apiType = 1
				this.videoTab ="text"
				this.currentApiType = apiType
				var resData = getDefualtApi(apiType,this.showToast)
				this.canGoOn=resData.canGoOn
				this.defaultSource=resData.defaultSource
				this.workflowId=resData.workflowId
				this.apiKey=resData.apiKey
				this.outputsNum=resData.outputsNum
				this.currentApi=resData.api
				eval(resData.api)
				this.apiFunction=apiFunction
			}else if(page == 'prompt'){
				this.promptPageNum=1
				this.prompts=[]
				this.searchPrompts(this.promptPageNum)
			}
			
        },loadMorePrompts(){
			this.promptPageNum=this.promptPageNum+1
			this.searchPrompts(this.promptPageNum)
		},
		searchPrompts: function(num) {
			var that = this;
			var data ={
				pageNum:num,
			}		
			
			$.ajax({
				type: "post",
				url:remoteUrl + "/admin/prompt/selectByPage",
				data: data,
				/* 跨域操作开始 */
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				/* 跨域操作结束 */
				success: function(res) {
					if(res.status == 200){
						for(item of res.data.records){
							that.prompts.push(item)
						}					
					} else {
						that.showToast('未找到新的记录', '#a78bfa');
					}					
				}
			});
			
		},
		/*查询*/
		search: function() {
			var that = this;
			$.ajax({
				url:remoteUrl + "/admin/generateRecords/selectByPage",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					pageNum: that.pageNum,
					pageSize: that.pageSize
				},
				success: function(response) {
					if (response.status == 200) {
						var datas = []
						for(item of response.data.records){
							var resourceType = "image"
							
							if(item.type == 1){
								resourceType ="video"
							}
							var resource ={
								url: remoteUrl +"/output/" + getFileInfoFromUrl(item.url).fullName,
								type :resourceType
							}
							that.records.push(resource)							
						}
					} else {
						 that.showToast('未找到新的记录', '#a78bfa');
					}
				}
		
			})
		
		},
        openUpload(type) {
            this.currentUploadType = type;
            //this.showSheet = true;
			this.localFileUpload()
        },
        selectPhoto() {
            this.showSheet = false;
            this.localFileUpload();
        },
        selectCamera() {
            this.showSheet = false;
            this.cameraUpload();
        },
		openCamera(object) {
		        // 强制调用相机
			object.setAttribute('capture', 'camera');
			object.click();
			
		},
		openAlbum(object) {
		        // 移除capture，默认打开相册
			object.removeAttribute('capture');
			object.click();
		},
        localFileUpload() {
			var that = this;           
            switch (this.currentUploadType) {
                case 'single': 
					 const fileInput = document.getElementById('single');
					 fileInput.addEventListener('change', function(e) {
					 	const file = e.target.files[0];
					 	if (!file) return;
					 		
					 	// 生成预览地址
						that.previewImage = uploadFile(file,that.toastShow)
					 	// const url = URL.createObjectURL(file);
						console.log("that.previewImage:"+that.previewImage)					 	
					 });
					 that.openAlbum(fileInput)
					 break;
					 
                case '21': 
					const fileInput1 = document.getElementById('21');
					fileInput1.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;							
						// 生成预览地址
						that.twoP1 = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.twoP1:"+that.twoP1)					 	
					});
					that.openAlbum(fileInput1)
					break;
				case '22': 
					const fileInput2 = document.getElementById('22');
					fileInput2.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;							
						// 生成预览地址
						that.twoP2 = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.twoP2:"+that.twoP2)					 	
					});
					that.openAlbum(fileInput2)
					break;				
				case '31': 
					const fileInput3 = document.getElementById('31');
					fileInput3.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;							
						// 生成预览地址
						that.threeP1 = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.threeP1:"+that.threeP1)					 	
					});
					that.openAlbum(fileInput3)
					break;		
				case '32': 
					const fileInput4 = document.getElementById('32');
					fileInput4.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;							
						// 生成预览地址
						that.threeP2 = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.threeP2:"+that.threeP2)					 	
					});
					that.openAlbum(fileInput4)
					break;		
				case '33': 
					const fileInput5 = document.getElementById('33');
					fileInput5.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;							
						// 生成预览地址
						that.threeP3 = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.threeP3:"+that.threeP3)					 	
					});
					that.openAlbum(fileInput5)
					break;		
                case 'singleVideo': 
					const fileInput6 = document.getElementById('singleVideo');
					fileInput6.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;
							
						// 生成预览地址
						that.previewVideoImg = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.previewVideoImg:"+that.previewVideoImg)					 	
					});
					that.openAlbum(fileInput6)
					break;

                case 'frameStart': 
					const fileInput7 = document.getElementById('frameStart');
					fileInput7.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;
							
						// 生成预览地址
						that.frameStart = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.frameStart:"+that.frameStart)					 	
					});
					that.openAlbum(fileInput7)
					break;
                case 'frameEnd': 
					const fileInput8 = document.getElementById('frameEnd');
					fileInput8.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;
							
						// 生成预览地址
						that.frameEnd = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.frameEnd:"+that.frameEnd)					 	
					});
					that.openAlbum(fileInput8)
					break;
                case 'videoReferenceImage': 
					const fileInput9 = document.getElementById('videoReferenceImage');
					fileInput9.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;
							
						// 生成预览地址
						that.videoReferenceImage = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.videoReferenceImage:"+that.videoReferenceImage)					 	
					});
					that.openAlbum(fileInput9)
					break;
				case 'previewSourceVideo':
					const fileInput10 = document.getElementById('previewSourceVideo');
					fileInput10.addEventListener('change', function(e) {
						const file = e.target.files[0];
						if (!file) return;
							
						// 生成预览地址
						that.previewSourceVideo = uploadFile(file,that.toastShow)
						// const url = URL.createObjectURL(file);
						console.log("that.previewSourceVideo:"+that.previewSourceVideo)					 	
					});
					that.openAlbum(fileInput10)
					break;
            }
        },
		async convertImageToBase64WithCanvas(url) {
			    try {
					
			        const response = await fetch(url);
			        const blob = await response.blob();
			        return new Promise((resolve, reject) => {
			            const img = new Image();
			            img.onload = () => {
			                const canvas = document.createElement('canvas');
			                const ctx = canvas.getContext('2d');
			                canvas.width = img.width;
			                canvas.height = img.height;
			                ctx.drawImage(img, 0, 0);
			                const dataUrl = canvas.toDataURL('image/png'); // 可以改为 'image/jpeg' 根据需要
			                resolve(dataUrl);
			            };
			            img.onerror = reject;
			            const objectUrl = URL.createObjectURL(blob);
			            img.src = objectUrl;
			        });
			    } catch (error) {
			        console.error('Error converting image to base64:', error);
			    }
		},base64ToFile(base64,fileName) {
			const binary = atob(base64.split(',')[1]); // 注意这里使用了split(',')[1]来移除data URI的前缀部分
		   // 将二进制数据转换为Uint8Array
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
			   bytes[i] = binary.charCodeAt(i);
			}
			// 创建Blob对象，然后转换为File对象
			return new File([bytes], fileName, { type: "image/png" });
		    
		},
		async uploadImageToComfyUI(imageUrl,fileName){
			var that=this
			var uploadedImage =null
			
			//  url ==> file
			await that.convertImageToBase64WithCanvas(imageUrl).then(item => {
							 uploadedImage = that.base64ToFile(item,fileName)
						})
			
			const formData = new FormData();
			formData.append('image', uploadedImage);
			try {
			     const response = await fetch(remoteUrl+'/admin/comfyui/upload/image', {
			        method: 'POST',
			        body: formData,
			    });
			    
			    if (!response.ok) {
			        return null;
			    }
			    
			    const data = await response.json();
			    return data.name; // 返回图片文件名
			} catch (error) {
			    console.error('上传图片失败:', error);
			    return null;
			}
		},async uploadVideoToComfyUI(videoUrl,fileName){
			var that=this
			const response = await fetch(videoUrl);
			 if (!response.ok) {
			        throw new Error('Network response was not ok');
			}
			const blob = await response.blob();
			const formData = new FormData();
			formData.append('image', blob, fileName); // 'video' 是服务器端接收文件的字段名
					
			try {
			    const response = await fetch(remoteUrl+'/admin/comfyui/upload/image', {
			        method: 'POST',
			        body: formData,
			    });
			    
			    if (!response.ok) {
			        return null;
			    }
			    
			    const data = await response.json();
			    return data.name; // 返回图片文件名
			} catch (error) {
			    console.error('上传图片失败:', error);
			    return null;
			}
		},
		upload2RH(name){
			var filename=null
			var that = this
			$.ajax({
				url: remoteUrl + "/comfyui/upload2RH",
				method: "POST", // 推荐使用 method 替代 type
				data: {
					name:name,
					apiKey:that.apiKey
				},
				
				success: function(response){					
					if (response.status == 200) {
						res = JSON.parse(response.data)
						filename = res.data.fileName
					}else{
						that.showToast(response.msg, '#a78bfa');
					}
				}
				
			})
			return filename
		},
        async createImage() {			
            var that =this;
			var response = null
			var res_data = null
			if(!that.canGoOn){
				that.showToast("未设置API", '#a78bfa');
				return
			}
			try{
				that.isGenerating = 1
				console.log("that.currentApiType："+that.currentApiType)
				var apiFunctionRes =null;
				if(!that.currentApi|| !that.apiFunction){
					that.showToast('未设置API', '#a78bfa');
					return
				}
				if(that.currentApiType == 0){
					if(isNaN(that.imageWith) || isNaN(that.imageHeight) || isNaN(that.imageSeed)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
						
					apiFunctionRes = that.generateWorkFlow0(that.imagePrompt,that.imageSeed,null,that.imageWith,that.imageHeight,null,null,null,null,null);
					console.log("that.defaultSource :"+that.defaultSource )
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
															method: 'POST',
															headers: {
																'Content-Type': 'application/json',
															},
															body: JSON.stringify({ prompt: apiFunctionRes }),
														});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}				
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.imagePrompt,type:0,apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}else if(that.currentApiType == 4){
					if(!that.previewImage){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.imageWith1) || isNaN(that.imageHeight1) || isNaN(that.imageSeed1)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					var Imagename= that.previewImage.split('/').pop().split('?')[0];
					Imagename =  encodeURI(Imagename);
					var name =null
					
					if (that.defaultSource == 1) {
						name=that.upload2RH(Imagename,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.previewImage]){
							name=uploadTocomfyUIImgs[that.previewImage]
						}else{
							name = await that.uploadImageToComfyUI(that.previewImage,Imagename);
							uploadTocomfyUIImgs[that.previewImage]=name
						}	
					}
								
					apiFunctionRes = that.generateWorkFlow4(that.imagePrompt1,that.imageSeed1,null,that.imageWith1,that.imageHeight1,name,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}
					
					var requestdata={}
					requestdata.referenceImage = that.previewImage
					
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.imagePrompt1,type:0,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}else if(that.currentApiType == 5){
					if(!that.twoP1 || !that.twoP2 ){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.imageWith2) || isNaN(that.imageHeight2) || isNaN(that.imageSeed2)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					
					var Imagename1= that.twoP1.split('/').pop().split('?')[0];
					Imagename1 =  encodeURI(Imagename1);
					var name1 =null
					if (that.defaultSource == 1) {
						name1=that.upload2RH(Imagename1,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.twoP1]){
							name1=uploadTocomfyUIImgs[that.twoP1]
						}else{
							name1 = await that.uploadImageToComfyUI(that.twoP1,name1);
							uploadTocomfyUIImgs[that.twoP1]=name1
						}
					}
					
					
								
					var Imagename2= that.twoP2.split('/').pop().split('?')[0];
					Imagename2 =  encodeURI(Imagename2);
					var name2 =null
					if (that.defaultSource == 1) {
						name2=that.upload2RH(Imagename2,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.twoP2]){
							name2=uploadTocomfyUIImgs[that.twoP2]
						}else{
							name2 = await that.uploadImageToComfyUI(that.twoP2,name2);
							uploadTocomfyUIImgs[that.twoP2]=name2
						}
					}
					
						
					apiFunctionRes = that.generateWorkFlow5(that.imagePrompt2,that.imageSeed2,null,that.imageWith2,that.imageHeight2,name1,name2,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}
					
					var requestdata={}
					requestdata.referenceImage1 = that.twoP1
					requestdata.referenceImage2 = that.twoP2
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.imagePrompt2,type:0,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
					
				}else if(that.currentApiType == 6){
					if(!that.threeP1 || !that.threeP2 ||  !that.threeP3){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.imageWith3) || isNaN(that.imageHeight3) || isNaN(that.imageSeed3)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					
					var Imagename1= that.threeP1.split('/').pop().split('?')[0];
					Imagename1 =  encodeURI(Imagename1);
					var name1 =null
					
					if (that.defaultSource == 1) {
						name1=that.upload2RH(Imagename1,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.threeP1]){
							name1=uploadTocomfyUIImgs[that.threeP1]
						}else{
							name1 = await that.uploadImageToComfyUI(that.threeP1,name1);
							uploadTocomfyUIImgs[that.threeP1]=name1
						}
					}
					
					
								
					var Imagename2= that.threeP2.split('/').pop().split('?')[0];
					Imagename2 =  encodeURI(Imagename2);
					var name2 =null
					
					if (that.defaultSource == 1) {
						name2=that.upload2RH(Imagename2,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.threeP2]){
							name2=uploadTocomfyUIImgs[that.threeP2]
						}else{
							name2 = await that.uploadImageToComfyUI(that.threeP2,name2);
							uploadTocomfyUIImgs[that.threeP2]=name2
						}
					}
					
					
						
					var Imagename3= that.threeP3.split('/').pop().split('?')[0];
					Imagename3 =  encodeURI(Imagename3);
					var name3 =null
					
					if (that.defaultSource == 1) {
						name3=that.upload2RH(Imagename3,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.threeP3]){
							name3=uploadTocomfyUIImgs[that.threeP3]
						}else{
							name3 = await that.uploadImageToComfyUI(that.threeP3,name3);
							uploadTocomfyUIImgs[that.threeP3]=name3
						}	
					}
					
					apiFunctionRes = that.generateWorkFlow6(that.imagePrompt3,that.imageSeed3,null,that.imageWith3,that.imageHeight3,name1,name2,name3,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}
					
					var requestdata={}
					requestdata.referenceImage1 = that.threeP1
					requestdata.referenceImage2 = that.threeP2
					requestdata.referenceImage3 = that.threeP3
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.imagePrompt3,type:0,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}
			}catch(e){
				
			}finally{
				that.isGenerating = 0
			}
        },
		generateWorkFlow0(prompt,seed,totalSteps,width,height,param1,param2,param3,param4,param5){			
			var that =this			
			var jsondata= that.apiFunction(prompt,seed,totalSteps,width,height,param1,param2,param3,param4,param5)			
			return jsondata	
		},
		generateWorkFlow4(prompt,seed,totalSteps,width,height,name,param1,param2,param3,param4,param5){		
			var that =this			
			var jsondata= that.apiFunction(prompt,seed,totalSteps,width,height,name,param1,param2,param3,param4,param5)			
			return jsondata	
		},generateWorkFlow5(prompt,seed,totalSteps,width,height,name1,name2,param1,param2,param3,param4,param5){			
			var that =this			
			var jsondata= that.apiFunction(prompt,seed,totalSteps,width,height,name1,name2,param1,param2,param3,param4,param5)			
			return jsondata	
		},generateWorkFlow6(prompt,seed,totalSteps,width,height,name1,name2,name3,param1,param2,param3,param4,param5){			
			var that =this			
			var jsondata= that.apiFunction(prompt,seed,totalSteps,width,height,name1,name2,name3,param1,param2,param3,param4,param5)			
			return jsondata	
		},generateWorkFlow1(prompt,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5){			
			var that =this			
			var jsondata= that.apiFunction(prompt,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5)			
			return jsondata	
		},
		generateWorkFlow2(prompt,name,audio1,audio2,audio3,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5){		
			var that =this			
			var jsondata= that.apiFunction(prompt,name,null,null,null,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5)			
			return jsondata	
		},generateWorkFlow3(prompt,name1,name2,audio1,audio2,audio3,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5){			
			var that =this
			var jsondata= that.apiFunction(prompt,name1,name2,null,null,null,seed,totalSteps,width,height,length,blocks_to_swap,param1,param2,param3,param4,param5)			
			return jsondata	
		},generateWorkFlow7(prompt,name,video,seed,totalSteps,width,height,length,skip,blocks_to_swap,param1,param2,param3,param4,param5){			
			var that =this			
			var jsondata= that.apiFunction(prompt,name,video,seed,totalSteps,width,height,length,skip,blocks_to_swap,param1,param2,param3,param4,param5)			
			return jsondata	
		},
        async createVideo() {
            var that =this;
			var response = null
			var res_data = null
			if(!that.canGoOn){
				that.showToast('未设置API', '#a78bfa');
				return
			}
			try{
				that.isGenerating = 1
				console.log("that.currentApiType："+that.currentApiType)
				var apiFunctionRes =null;
				if(!that.currentApi|| !that.apiFunction){
					that.showToast('未设置API', '#a78bfa');
					return
				}
				if(that.currentApiType == 1){
					if(isNaN(that.videoWidth) || isNaN(that.videoHeight) || isNaN(that.videoSeed)|| isNaN(that.longs)|| isNaN(that.blocks_to_swap)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					apiFunctionRes = that.generateWorkFlow1(that.videoPrompt,that.videoSeed,null,that.videoWidth,that.videoHeight,that.longs,that.blocks_to_swap,null,null,null,null,null);
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
															method: 'POST',
															headers: {
																'Content-Type': 'application/json',
															},
															body: JSON.stringify({ prompt: apiFunctionRes }),
														});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}
					
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.videoPrompt,type:1,apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}else if(that.currentApiType == 2){
					if(!that.previewVideoImg){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.videoWidth1) || isNaN(that.videoHeight1) || isNaN(that.videoSeed1)|| isNaN(that.longs1)|| isNaN(that.blocks_to_swap1)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					var Imagename= that.previewVideoImg.split('/').pop().split('?')[0];
					Imagename =  encodeURI(Imagename);
					var name =null
					if (that.defaultSource == 1) {
						name=that.upload2RH(Imagename,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.previewVideoImg]){
							name=uploadTocomfyUIImgs[that.previewVideoImg]
						}else{
							name = await that.uploadImageToComfyUI(that.previewVideoImg,Imagename);
							uploadTocomfyUIImgs[that.previewVideoImg]=name
						}	
					}
					
					
					apiFunctionRes = that.generateWorkFlow2(that.videoPrompt1,name,null,null,null,that.videoSeed1,null,that.videoWidth1,that.videoHeight1,that.longs1,that.blocks_to_swap1,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}
					
					var requestdata={}
					requestdata.referenceImage = that.previewVideoImg 
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.videoPrompt1,type:1,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}else if(that.currentApiType == 3){
					if(!that.frameStart || !that.frameEnd ){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.videoWidth2) || isNaN(that.videoHeight2) || isNaN(that.videoSeed2) || isNaN(that.longs2) || isNaN(that.blocks_to_swap2)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					
					var Imagename1= that.frameStart.split('/').pop().split('?')[0];
					Imagename1 =  encodeURI(Imagename1);
					var name1 =null
					
					
					if (that.defaultSource == 1) {
						name1=that.upload2RH(Imagename1,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.frameStart]){
							name1=uploadTocomfyUIImgs[that.frameStart]
						}else{
							name1 = await that.uploadImageToComfyUI(that.frameStart,name1);
							uploadTocomfyUIImgs[that.frameStart]=name1
						}	
					}
					
					var Imagename2= that.frameEnd.split('/').pop().split('?')[0];
					Imagename2 =  encodeURI(Imagename2);
					var name2 =null
					
					if (that.defaultSource == 1) {
						name2=that.upload2RH(Imagename2,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						
						if(uploadTocomfyUIImgs[that.frameEnd]){
							name2=uploadTocomfyUIImgs[that.frameEnd]
						}else{
							name2 = await that.uploadImageToComfyUI(that.frameEnd,name2);
							uploadTocomfyUIImgs[that.frameEnd]=name2
						}
					}
									
					apiFunctionRes = that.generateWorkFlow3(that.videoPrompt2,name1,name2,null,null,null,that.videoSeed2,null,that.videoWidth2,that.videoHeight2,that.longs2,that.blocks_to_swap2,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}				
					var requestdata={}
					requestdata.referenceImage1 = that.frameStart
					requestdata.referenceImage2 = that.frameEnd
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.videoPrompt2,type:1,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
					
				}else if(that.currentApiType == 7){
					if(!that.videoReferenceImage || !that.previewSourceVideo ){
						that.showToast('请上传参考图', '#a78bfa');
						return
					}
					if(isNaN(that.videoWidth3) || isNaN(that.videoHeight3) || isNaN(that.videoSeed3) || isNaN(that.longs3) || isNaN(that.blocks_to_swap3)){
						that.showToast('非法参数', '#a78bfa');
						return
					}
					
					var Imagename1= that.videoReferenceImage.split('/').pop().split('?')[0];
					Imagename1 =  encodeURI(Imagename1);
					var name1 =null
					
					if (that.defaultSource == 1) {
						name1=that.upload2RH(Imagename1,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.videoReferenceImage]){
							name1=uploadTocomfyUIImgs[that.videoReferenceImage]
						}else{
							name1 = await that.uploadImageToComfyUI(that.videoReferenceImage,name1);
							uploadTocomfyUIImgs[that.videoReferenceImage]=name1
						}
					}
					
					
								
					var Imagename2= that.previewSourceVideo.split('/').pop().split('?')[0];
					Imagename2 =  encodeURI(Imagename2);
					var name2 =null
					
					if (that.defaultSource == 1) {
						name2=that.upload2RH(Imagename2,that.apiKey)
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						if(uploadTocomfyUIImgs[that.previewSourceVideo]){
							name2=uploadTocomfyUIImgs[that.previewSourceVideo]
						}else{
							name2 = await that.uploadVideoToComfyUI(that.previewSourceVideo,name2);
							uploadTocomfyUIImgs[that.previewSourceVideo]=name2
						}
					}
					
					
					apiFunctionRes = that.generateWorkFlow7(that.videoPrompt3,name1,name2,that.videoSeed3,null,that.videoWidth3,that.videoHeight3,that.longs3,that.skip3,that.blocks_to_swap3,null,null,null,null,null)
					if (that.defaultSource == 1) {
						response = await fetch(remoteUrl + "/comfyui/rhprompt", {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								"nodeInfoList": apiFunctionRes,
								"workflowId": that.workflowId,
								"apiKey": that.apiKey,
							}),
						});
						
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						that.prompt_id = res_data.taskId;
						if (res_data.errorCode) {
							that.showToast(res_data.errorMessage, '#a78bfa');
							return
						}
					}else if (that.defaultSource == 0 || that.defaultSource == 2) {
						response =await fetch(remoteUrl + "/comfyui/prompt?timestamp="+that.currentTime, {
											method: 'POST',
											headers: {
												'Content-Type': 'application/json',
											},
											body: JSON.stringify({ prompt: apiFunctionRes }),
										});
						if (!response.ok) {
							throw new Error(`HTTP错误: ${response.status}`);
						}
						res_data = await response.json();
						console.log(res_data)
						if(res_data.status!=200){
							that.showToast(res_data.msg, '#a78bfa');
							return
						}
						console.log(res_data)
						resultData = JSON.parse(res_data.data) ;
						that.prompt_id= resultData.prompt_id;
					}
					
					if (!that.prompt_id) {
						throw new Error('未能获取任务ID');
					}				
					var requestdata={}
					requestdata.referenceImage = that.videoReferenceImage
					requestdata.referenceVideo = that.previewSourceVideo
					const result =await fetch(remoteUrl + "/comfyui/getResult?timestamp="+that.currentTime, {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({ id: that.prompt_id,outputsNum:that.outputsNum,prompt:that.videoPrompt3,type:1,requestdata:JSON.stringify(requestdata),apiKey:that.apiKey,defaultSource:that.defaultSource}),
									});
					
					if (result.ok) {
						that.showToast('~已加入队列~', '#a78bfa');
						//that.switchPage('record');
					}else{
						that.showToast('生成失败', '#a78bfa');
					}
				}
			}catch(e){
				//TODO handle the exception
			}finally{
				that.isGenerating = 0
			}
            
        },
        usePrompt(content) {
			this.copyModern(content)
            this.showToast('提示词已填充', '#a78bfa');
        },
		async copyModern(text) {
		 try {
		     // 1. 优先使用现代异步剪贴板（必须包装在用户交互中）
		     await navigator.clipboard.writeText(text);
		     // 复制成功可在这里加提示
		     // alert('复制成功');
		   } catch (err) {
		     // 2. 降级兼容方案（专门修复移动端）
		     this.fallbackCopy(text);
		   }
		},
		
		// 兼容旧版
		fallbackCopy(text) {
		  // 创建 textarea（比 input 移动端兼容性更好）
		   const textarea = document.createElement('textarea');		   
		   // 关键：解决移动端选中失效问题
		   textarea.value = text;
		   textarea.style.position = 'fixed';
		   textarea.style.opacity = '0';
		   textarea.style.left = '-9999px';
		   textarea.style.top = '0';
		   textarea.style.zIndex = '-1';
		   
		   // 防止iOS键盘弹出
		   textarea.setAttribute('readonly', 'readonly');
		   
		   document.body.appendChild(textarea);
		   
		   // 兼容全机型选中
		   const selection = document.getSelection();
		   selection.removeAllRanges(); // 清空选中
		   
		   const range = document.createRange();
		   range.selectNodeContents(textarea);
		   selection.addRange(range);
		   
		   // 执行复制
		   document.execCommand('copy');
		   
		   // 清理
		   document.body.removeChild(textarea);
		   selection.removeAllRanges(); // 取消选中
		},
        addPrompt() {
			this.promptType=1
            this.showEditModal = true;
			this.prompt={}           
        },
        openEditModal(item) {  
			this.promptType =0;
            this.showEditModal = true;
			this.prompt=item
        },
        closeEditModal() {
            this.showEditModal = false;
        },
		closeEditModalApi() {
		    this.showEditApi = false;
		},
		saveEditAPI() {
		   var that =this
		  
		   $.ajax({
		   	type: "post",
		   	url: remoteUrl+ "/admin/api/update",
		   	data: that.currentApi,
		   	/* 跨域操作开始 */
		   	xhrFields: {
		   		withCredentials: true
		   	},
		   	crossDomain: true,
		   	/* 跨域操作结束 */
		   	success: function(res) {
		   		if(res.status == 200){
		   			console.log("API设置成功")
		   			// location.reload(true);
		   
		   		} else {
		   			console.log("API设置失败")
		   		}
		   		
		   	}
		   });
		   
		   
		   that.currentApi = null;
		   that.apiFunction =null;
		   $.ajax({
		   	url: remoteUrl + "/admin/api/getDefalutApi",
		   	method: "POST", // 推荐使用 method 替代 type
		   	data: {
		   		type: that.currentApiType
		   	},
		   	success: function(response) {
		   		if (response.status == 200) {
		   			that.outputsNum = response.data.outputsNum
		   			that.currentApi = response.data.api			
		   			that.defaultSource=response.data.defaultSource
		   			that.workflowId=response.data.workflowId
		   			that.apiKey=response.data.apiKey	
					that.canGoOn =true
		   		} else {
					that.canGoOn=false
		   			that.showToast('寻查询到模板信息', '#a78bfa');
		   		}
		   	}
		   })
		   eval(that.currentApi)
		   that.apiFunction = apiFunction
		    this.closeEditModalApi();
		    this.showToast('设置成功', '#a78bfa');
		},
        saveEdit() {
            if (!this.prompt.name || !this.prompt.prompt) {
                this.showToast('内容不能为空', '#ff6a6a');
                return;
            }
			var that =this
			if(this.promptType == 1){
				$.ajax({
					type: "post",
					url: remoteUrl + "/admin/prompt/insert",
					data: that.prompt,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							that.promptPageNum=1
							that.prompts=[]
							that.searchPrompts(that.promptPageNum)
							 that.showToast('修改成功', '#a78bfa');
						} else {
							 that.showToast('修改失败', '#ff6a6a');
						}
						
					}
				});		   
			}else{
				$.ajax({
					type: "post",
					url: remoteUrl + "/admin/prompt/update",
					data: that.prompt,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							 that.showToast('修改成功', '#a78bfa');
						} else {
							 that.showToast('修改失败', '#ff6a6a');
						}
						
					}
				});
			}
			
            this.closeEditModal();
        },
        delPrompt(item,i) {
            if (confirm('确定删除？')) {
				var that =this
				$.ajax({
					type: "post",
					url: remoteUrl + "/admin/prompt/delete",
					data: item,
					/* 跨域操作开始 */
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					/* 跨域操作结束 */
					success: function(res) {
						if(res.status == 200){
							that.showToast('删除成功', '#a78bfa');
							that.prompts.splice(i, 1);
						} else {
							that.showToast('删除失败', '#ff6a6a');
						}
						
					}
				});  
            }
        },
        showToast(text, bg) {
            this.toastText = text;
            this.toastBg = bg;
            this.toastShow = true;
            setTimeout(() => this.toastShow = false, 1800);
        },
       
      
        loadMoreData() {
			var that =this          
			that.pageNum = that.pageNum +1
            setTimeout(() => {
                that.search()
               
            }, 500);
        }
    }
}).mount('#app');