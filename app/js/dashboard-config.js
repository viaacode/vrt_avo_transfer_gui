
function getGraphsFromConfig()
{
    return {
        // Note: chartId value doesn't matter at all but has to be unique
        // apiUrls correspond with the dropdown menu options
        // charType: line, bar, doughnut, pie, radar, polar, horizontalBar
        evolutionRegistration: { 
            chartId: 'evoReg',
            chartTitle: 'Evolutie Registratie',
            chartType: 'line',
            chartFormat: 0,
            apiUrls: [
                '/api/report/ams/items?gran=last-day',
                '/api/report/ams/items?gran=last-week',
                '/api/report/ams/items?gran=last-month',
                '/api/report/ams/items?gran=last-year'
            ],
            data: {},
            errormessages: [],
            activeView: 'effective',
            isLoading: false 
        },
        archiveGrowth: {
            chartId: 'archiGrowth',
            chartTitle: 'Aangroei Archief',
            chartType: 'line',
            chartFormat: 0,
            apiUrls: [
                '/api/report/mam/items?gran=last-day',
                '/api/report/mam/items?gran=last-week',
                '/api/report/mam/items?gran=last-month',
                '/api/report/mam/items?gran=last-year'
            ],
            data: {},
            errormessages: [],
            activeView: 'cumulative',
            isLoading: false 
        },
    };
}

// formatType should match the option of the graph dropdown menu
// Choose a date format per graph view 
function getFormatString(formatType) {
    if(formatType == '0') formatString = 'DD/MM HH:mm';
    else if(formatType == 1) formatString = 'DD/MM/YYYY';
    else if(formatType == 2) formatString = 'DD/MM/YYYY';
    else if(formatType == 3) formatString = 'DD/MM/YYYY';
    return formatString;
}