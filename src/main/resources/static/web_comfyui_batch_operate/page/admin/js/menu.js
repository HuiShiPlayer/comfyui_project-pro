/**
 * Created by Administrator on 2016/11/10.
 */
$.sidebarMenu = function(menu) {
    var animationSpeed = 300;

    $(menu).on('click', 'li a', function(e) {
        var $this = $(this);
        var checkElement = $this.next();

        if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
            checkElement.slideUp(animationSpeed, function() {
                checkElement.removeClass('menu-open');
            });
            checkElement.parent("li").removeClass("active");
        }

        //If the menu is not visible
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
            //Get the parent menu
            var parent = $this.parents('ul').first();
            //Close all open menus within the parent
            var ul = parent.find('ul:visible').slideUp(animationSpeed);
            //Remove the menu-open class from the parent
            ul.removeClass('menu-open');
            //Get the parent li
            var parent_li = $this.parent("li");

            //Open the target menu and add the menu-open class
            checkElement.slideDown(animationSpeed, function() {
                //Add the class active to the parent li
                checkElement.addClass('menu-open');
                parent.find('li.active').removeClass('active');
                parent_li.addClass('active');
            });
        }
        //if this isn't a link, prevent the page from being redirected
        if (checkElement.is('.treeview-menu')) {
            e.preventDefault();
        }
    });
}
$(function () {
    $.sidebarMenu($('.sidebar-menu'));
    /*左侧导航栏缩进功能*/
    $(".treeview-menu li").click(function(){
        $(this).addClass("light").siblings().removeClass("light");
    })
    $(".sidebar-fold").click(function () {

        $("body").on("click",".htreeview>.treeview-menu>li>a",function(){

            if($(this).parent("li").hasClass("active")){

                $(this).parent("li").removeClass("active");
                $(this).parent("li").find(".treeview-menu").removeClass("menu-open");
                $(this).parent("li").find(".treeview-menu").removeClass("menu-open").css("display","none");
            }else{
                $(this).parent("li").addClass("active").siblings().removeClass("active");
                $(this).parent("li").find(".treeview-menu").addClass("menu-open");
            }

        });
        if ($(".main-sidebar").attr('class') == "main-sidebar left-full") {
            $(".main-sidebar").removeClass("left-full");
            $(".main-sidebar").addClass("left-off");

            $(".main").removeClass("right-full");
            $(".main").addClass("right-off");

            $(".main-sidebar.left-off .sidebar-menu>li").mouseenter(function () {

                var menutop = $(this).offset().top;
                var htreeview = $(this).html()
                $(".htreeview").html(htreeview);
                $(".main-sidebar.left-off>.htreeview").css({
                    "display": "block",
                    "top": menutop
                });
                var windowh = $(window).height();
                var boxh = $(".main-sidebar>.htreeview").height();
                var bottomh = windowh - boxh - menutop

                if (bottomh < 0 && boxh < menutop) {
                    $(".main-sidebar>.htreeview").css({
                        "top": menutop - boxh + 45
                    });
                }
                else {
                    $(".main-sidebar>.htreeview").css({
                        "top": menutop
                    });

                }

            })

            $(".main-sidebar.left-off .sidebar-menu>li").mouseenter(function () {

                $(this).addClass("hover").siblings().removeClass("hover");
                $(".main-sidebar.left-off .htreeview>.treeview-menu").css("display","block")
            })
                $(".main-sidebar").mouseleave(function () {
                    $(".main-sidebar.left-off >.htreeview").css("display","none");
                    $(".main-sidebar.left-off >.htreeview").unbind();
                    $(".main-sidebar.left-off .sidebar-menu>li").removeClass("hover");

            });



        }

        else {

            $(".main-sidebar").removeClass("left-off");
            $(".main-sidebar").addClass("left-full");
            $(".main").removeClass("right-off");
            $(".main").addClass("right-full");
        }

    });

})
