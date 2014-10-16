FusionCharts.ready(function () {

    $.get('/statistics').done(function(resp) {
        var fastSameAsForeground = {
            saw: 0,
            didNot: 0
        };
        var fastNotSameAsForeground = {
            saw: 0,
            didNot: 0
        };
        var slowSameAsForeground = {
            saw: 0,
            didNot: 0
        };
        var slowNotSameAsForeground = {
            saw: 0,
            didNot: 0
        };
        
        resp.forEach(addStats);


        function addStats(testRun) {
            if(testRun.backgroundSpeed === 'fast') {
                if(testRun.sameAsForeground) {
                    if(testRun.noticedObject) {
                        fastSameAsForeground.saw += 1;
                    } else {
                        fastSameAsForeground.didNot += 1;
                    }
                } else {
                    if(testRun.noticedObject) {
                        fastNotSameAsForeground.saw += 1;
                    } else {
                        fastNotSameAsForeground.didNot += 1;
                    }
                }
            } else {
                if(testRun.sameAsForeground) {
                    if(testRun.noticedObject) {
                        slowSameAsForeground.saw += 1;
                    } else {
                        slowSameAsForeground.didNot += 1;
                    }
                } else {
                    if(testRun.noticedObject) {
                        slowNotSameAsForeground.saw += 1;
                    } else {
                        slowNotSameAsForeground.didNot += 1;
                    }
                }
            }
        }

        drawChart('chart-container-1', 'slow', 'yes', slowSameAsForeground.saw, slowSameAsForeground.didNot);
        drawChart('chart-container-2', 'slow', 'no', slowNotSameAsForeground.saw, slowNotSameAsForeground.didNot);
        drawChart('chart-container-3', 'fast', 'yes', fastSameAsForeground.saw, fastSameAsForeground.didNot);
        drawChart('chart-container-4', 'fast', 'no', fastNotSameAsForeground.saw, fastNotSameAsForeground.didNot);
    });

    function drawChart(divId, backgroundSpeed, sameAsForeground, didSee, didNotSee) {
        var demographicsChart = new FusionCharts({
            type: 'pie3d',
            renderAt: divId,
            width: '450',
            height: '300',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "Background speed: " + backgroundSpeed,
                    "subCaption": 'Color of hidden object same as foreground: ' + sameAsForeground,
                    "startingAngle": "120",
                    "showLabels": "0",
                    "showLegend": "1",
                    "enableMultiSlicing": "0",
                    "slicingDistance": "15",
                    //To show the values in percentage
                    "showPercentValues": "1",
                    "showPercentInTooltip": "0",
                    "plotTooltext": "$label",
                    "theme": "fint"
                },
                "data": [{
                    "label": "Saw object",
                    "value": "" + didSee
                }, {
                    "label": "Didn't see object",
                    "value": "" + didNotSee
                }]
            }
        });
        demographicsChart.render();
    }
});