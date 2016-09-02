(function() {
    var charts = [];
    var runningAjaxCalls = [];

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: {},
            dataPiechart: {},
            dataErrors: []
        },
        created: function() { 
            refreshView(this);
        },
        methods: {
            
        }
    });

    // Refresh the whole view
    function refreshView(vueinstance){
        // Destroy all charts
        for(var i = 0; i < charts.length; i++) {
            charts[i].destroy();
        }

        // Abort all running ajax calls (view refreshing bug)
        for(var j = 0; j < runningAjaxCalls.length; j++) {
            runningAjaxCalls[j].abort();
        }

        // Clean the view
        runningAjaxCalls = [];
        vueinstance.dataStats = '';

        var theGraphs = vueinstance.graphs;

        // Put all isLoading booleans to true
        for(var item in theGraphs) {
            vueinstance.graphs[item].isLoading = true;   
        }
     
        // 'Big stats' on top
        // runningAjaxCalls.push(ajaxcall("/api/stats", function(err, result) {
        //     if(err) { vueinstance.dataErrors.push(err); }
        //     else {         
        //         dataErrors = [];
        //         vueinstance.progress = result; // For loader (?)

        //         var dataPieChartStats = {};

        //         // Loop through all mime-types that are archived
        //         for (var mime_type in result.archived) {
        //             if (mime_type != "total" && result.archived[mime_type].amount.ok !== 0) {
        //                 dataPieChartStats[mime_type] = result.archived[mime_type].amount.ok;
        //             }
        //         }

        //         vueinstance.dataPieChartStats = dataPieChartStats;

        //         drawPieFromKvpObj('statsChart', dataPieChartStats, vueinstance.dataPieChartColors);
        //     }
        // }));     
    }

    /*************************************
     * ***  Chart drawing and stuff    ***
     * ***********************************
     */

    // Split object key/values and draw them on piechart #id
    function drawPieFromKvpObj(id, obj, colors) {
        var ctx = document.getElementById(id);
        var keys = [];
        var vals = [];
        var backgroundColorList = colors;
        var backgroundColor = [];
        var hoverBackgroundColorList = colors;
        var hoverBackgroundColor = [];

        var i = 0;
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
                vals.push(obj[key]);
                backgroundColor.push(backgroundColorList[i]);
                hoverBackgroundColor.push(hoverBackgroundColorList[i]);
                i++;
                // when overflow
                i = (i % backgroundColorList.length);
            }
        }

        var data = {
            labels: keys,
            datasets: [{
                data: vals,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: hoverBackgroundColor
            }]
        };

        var myChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display:false    // legend above chart
                },
            }
        });     

        charts.push(myChart);  
    }
})();
