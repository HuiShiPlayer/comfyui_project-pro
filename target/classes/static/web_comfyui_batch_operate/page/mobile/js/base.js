$.ajaxSetup({
	async: false
});
const protocol = window.location.protocol;
const domain = window.location.hostname;
var port = window.location.port || (protocol === 'https:' ? 443 : 80);

/* todo dev */
port = 6799

var remoteUrl = protocol+"//"+domain+":"+port
console.log("remoteUrl:"+remoteUrl)


function getFileInfoFromUrl(url) {
  if (!url) return { fullName: '', fileName: '', ext: '' };

  // 1. 去掉 ? 和 # 后面的内容
  const cleanUrl = url.split(/[?#]/)[0];

  // 2. 取最后一段（文件名）
  const fullName = cleanUrl.split('/').pop() || '';

  // 3. 找最后一个 . 分割后缀
  const lastDotIndex = fullName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return {
      fullName,
      fileName: fullName,
      ext: ''
    };
  }

  const fileName = fullName.slice(0, lastDotIndex);
  const ext = fullName.slice(lastDotIndex + 1).toLowerCase();

  return { fullName, fileName, ext };
}

function getApi(apiType,classType){
	console.log(classType)
	var apis =[]
	$.ajax({
		type: "post",
		url: remoteUrl + "/admin/api/getApi",
		data: {
			type:apiType,
			classType:classType
		},
		/* 跨域操作开始 */
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		/* 跨域操作结束 */
		success: function(res) {
			if(res.status == 200){
				for(item of res.data){
					if(item.isDefault==1){
						item.isSelect=true
					}else{
						item.isSelect=false
					}
					apis.push(item)
				}
			}
		}
	});
	return apis;
}

function getDefualtApi(apiType,showToast){
	var resData={}
	$.ajax({
		url: remoteUrl + "/admin/api/getDefalutApi",
		method: "POST", // 推荐使用 method 替代 type
		data: {
			type: apiType
		},
		success: function(response) {
			if (response.status == 200) {
				resData.outputsNum = response.data.outputsNum
				resData.api = response.data.api
				resData.defaultSource = response.data.classType
				resData.workflowId = response.data.workflowId
				resData.apiKey = response.data.apiKey
				resData.canGoOn=true
			} else {
				resData.canGoOn=false
				showToast('未设置API', '#a78bfa')
			}
		}
	})
	return resData;
	
	
}

function uploadFile(file,showToast){
	var formData = new FormData();
	formData.append('file', file)
	var r=null;
	 $.ajax({
	        url: remoteUrl + "/admin/upload", // 服务器端点URL
	        type: 'POST',
	        data: formData,
	        processData: false, // 告诉jQuery不要处理发送的数据
	        contentType: false, // 告诉jQuery不要设置Content-Type请求头
	        success: function (res) {
				if(res.status==200){
					r =remoteUrl+"/"+ res.data;
				}	           
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
				showToast('上传失败', '#a78bfa')
	        }
	    });
	return r;
}
