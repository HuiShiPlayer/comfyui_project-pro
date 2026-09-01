/**
 * Created by Administrator on 2017/5/4.
 */
$.validator.setDefaults({
    submitHandler: function() {
        alert("提交成功!");
    }
});



$(document).ready(function() {
    $.fn.manhuaInputLetter = function(options) {
        var defaults = {
            len : 200,
            showId : "show"
        };
        var options = $.extend(defaults,options);
        var $input = $(this);
        var $show = $("#"+options.showId);
        $show.html(options.len);
        $input.on("keydown keyup blur",function(e){
            var content =$(this).val();
            var length = content.length;
            var result = options.len - length;
            if (result >= 0){
                $show.html(result);
            }else{
                $(this).val(content.substring(0,options.len))
            }
        });
    };
    $("#comment").manhuaInputLetter({
        len : 200,//限制输入的字符个数
        showId : "sid"//显示剩余字符文本标签的ID
    });

    // validate the comment form when it is submitted
    $("#signup").validate({
        
    });

    // validate signup form on keyup and submit
    $("#signupForm").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            username: {
                required: true,
                rangelength:[4,20]
            },
            password: {
                required: true,
                rangelength:[6,16]
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            topic: {
                required: "#newsletter:checked",
                minlength: 2
            },
            tel:{
                required: true,
                tel:true
            },
            mobile:{
                required: true,
                mobile:true
            },
            idCard:{
                idCard:true
            },
            bankCard:{
                bankCard:true
            },
            number:{
                number:true,
                maxlength: 15
            },
            noactel:{
                noactel:true
            },
            mm:{
                mm:true
            },
            age:{
                age:true,
            },
            fax:{
                fax:true,
            },
            chinese:{
                chinese:true,
            },
            english:{
                english:true,
            },
            num:{
                num:true,
            },

            
            agree: "required"
        },
        messages: {

            firstname: "请输入您的名字",
            lastname: "请输入您的姓",
            username: {
                required: "请输入用户名",
                rangelength: "您的用户名要在4到20个字符之间"
            },
            password: {
                required: "请输入您的密码",
                minlength: "您的密码必须至少5个字符长"
            },
            confirm_password: {
                required: "请再次输入您的密码",
                minlength: "您的密码必须至少5个字符长",
                equalTo: "请输入与上面相同的密码"
            },
            tel: {
                required: "请您输入电话号码"
            },
            mobile: {
                required: "请您输入手机号码"
            },
            email: "请输入有效的电子邮件地址",
            agree: "请接受我们的政策",
            topic: "请至少选择2个主题"
        }
    });

    // propose username by combining first- and lastname
    $("#username").focus(function() {
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        if (firstname && lastname && !this.value) {
            this.value = firstname + "." + lastname;
        }
    });

    //code to hide topic selection, disable for demo
    var newsletter = $("#newsletter");
    // newsletter topics are optional, hide at first
    var inital = newsletter.is(":checked");
    var topics = $("#newsletter_topics")[inital ? "removeClass" : "addClass"]("gray");
    var topicInputs = topics.find("input").attr("disabled", !inital);
    // show when newsletter is checked
    newsletter.click(function() {
        topics[this.checked ? "removeClass" : "addClass"]("gray");
        topicInputs.attr("disabled", !this.checked);
    });
});


