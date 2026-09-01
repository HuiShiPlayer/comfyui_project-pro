/**
 * Created by Administrator on 2016/12/28.
 */
$(function() {
    var myChart = echarts.init(document.getElementById('ring'));
    var labelTop = {
        normal : {
            label : {
                show : true,
                position : 'center',
                formatter : '{b}',
                textStyle: {
                    baseline : 'bottom',
                    color:'#666'
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var labelFromatter = {
        normal : {
            label : {
                formatter : function (params){
                    return 100 - params.value + '%'
                },
                textStyle: {
                    baseline : 'top',
                    color:'#666'
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
    var radius = [65, 70];
    var option = {
        legend: {
            show : false,
            x : 'center',
            y : 'center',
            data:[
                'GoogleMaps','Facebook','Youtube'
            ]
        },


        series : [
            {
                type : 'pie',
                center : ['15%', '50%'],
                radius : radius,
                x: '0%', // for funnel
                itemStyle : labelFromatter,
                color:'#ccc',
                data : [
                    {name:'other', value:46, itemStyle : labelBottom},
                    {name:'GoogleMaps', value:54,itemStyle : labelTop}
                ]
            },
            {
                type : 'pie',
                center : ['45%', '50%'],
                radius : radius,
                x:'20%', // for funnel
                itemStyle : labelFromatter,
                data : [
                    {name:'other', value:56, itemStyle : labelBottom},
                    {name:'Facebook', value:44,itemStyle : labelTop}
                ]
            },
            {
                type : 'pie',
                center : ['75%', '50%'],
                radius : radius,
                x:'40%', // for funnel
                itemStyle : labelFromatter,
                data : [
                    {name:'other', value:65, itemStyle : labelBottom},
                    {name:'Youtube', value:35,itemStyle : labelTop}
                ]
            }
        ]
    };

    myChart.setOption(option);
})