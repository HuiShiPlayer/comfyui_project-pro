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
					}else if (that.defaultSource == 0) {
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
					}else if (that.defaultSource == 0) {
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