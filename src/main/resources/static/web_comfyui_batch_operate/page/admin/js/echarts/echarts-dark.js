$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('dark'));

     var labelTop = {
        normal : {

            label : {
                show : true,
                position : 'center',
                formatter : '{b}',
                textStyle: {
                    baseline : 'middle'
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var labelFromatter = {
        normal : {
            color :'#ff906b',
            label : {
                formatter : function (params){
                    return 100 - params.value + '%'
                },
                textStyle: {
                    baseline : 'middle',
                    color :'#b5c334',
                }
            }
        },
    }

    var labelFromatter1 = {
        normal : {
            color :'#9bca63',
            label : {
                formatter : function (params){
                    return 100 - params.value + '%'
                },
                textStyle: {
                    baseline : 'middle',
                    color :'#b5c334',
                }
            }
        },
    }
    var labelBottom = {
        normal : {
            color: '#ccc',
            label : {
                show : true,
                position : 'center'
            },
            labelLine : {
                show : false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    var radius = [55, 40];
    option = {
        color:['#ff906b','#9bca63'],
        legend: {
            itemWidth: 8,
            itemHeight: 8,
            x : '3%',
            y : '80%',
            data:[
                '产品类销售额：12345万元','项目类销售额：23456万元',
            ],

            textStyle:{    //图例文字的样式
                fontSize:12,
                fontFamily:'微软雅黑',
            },

        },


        series : [
            {
                type : 'pie',
                center : ['22%', '40%'],
                radius : radius,
                x: '0%', // for funnel
                itemStyle : labelFromatter,
                data : [
                    {name:'other', value:46, itemStyle : labelBottom},
                    {name:'', value:54,itemStyle : labelTop}
                ]
            },
            {
                type : 'pie',
                center : ['70%', '40%'],
                radius : radius,
                x:'100%', // for funnel
                itemStyle : labelFromatter1,
                data : [
                    {name:'other', value:56, itemStyle : labelBottom},
                    {name:'', value:44,itemStyle : labelTop}
                ]
            },


        ]
    };




    // 为echarts对象加载数据
    myChart.setOption(option);

})