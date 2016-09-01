(function() {
    function getDataFromOverviewForService(service) {
        servicelist = getServicesList();
        for(var i = 0; i < servicelist.length; i++) {
            if(servicelist[i].service == service) return servicelist[i];
        }
        
        // Service not found -> Redirect back to services page
        window.location.replace('services');
    }

    var service = window.location.hash.substring(1).toUpperCase();  // Get service from URL after #, ex #mam becomes MAM
    document.title = service + ' \u2013 Mijn VIAA'; // Set Title

    new Vue({
        el: '#service-detail',
        data: {
            dataAPI: '',
            dataHard: getDataFromOverviewForService(service),
            serviceslist: getServicesList(),
            errormsg: '',
        },
        methods: {
            reload: function() {
                window.location.reload();
            }
        },
        created: function() {
            var thisvue = this;
            ajaxcall("/api/services/" + service, function(err, result) {
                if(err) thisvue.errormsg = err;
                else thisvue.dataAPI = result;
            });
        }
    });
})();
