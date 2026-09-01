$(function(){
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('line'));

    var option = {
        title : {
            text: '折线图',
            textStyle: {
                fontFamily: 'microsoft yahei',
                fontWeight: '300',
                color: '#333'          // 主标题文字颜色
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}",

        },
        xAxis: [

            {
                type: "category",
                name: "x",
                splitLine: {show: false},
                data: ["一", "二", "三", "四", "五", "六", "七", "八", "九"],

            }
        ],
        yAxis: [
            {
                type: "log",
                name: "y"
            }
        ],
        calculable: true,
        series: [
            {
                name: "2的指数",
                type: "line",
                data: [1, 50, 4, 8, 300, 32, 64, 128, 256],
                fontFamily : '微软雅黑',
                itemStyle : {
                    normal : {
                        color:'transparent',
                        lineStyle:{
                            width:'2',
                            color:'#fb9678'
                        }
                    }
                }

            }
        ]
    };



    // 为echarts对象加载数据
    myChart.setOption(option);

})