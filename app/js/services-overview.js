(function() {
    new Vue({
        el: '#services-app',
        data: {
            serviceslist: getServicesList(),
            zendesk: {},
            erorrmessage: '',
        },
        methods: {
            reload: function() {
                window.location.reload();
            }
        },
        created: function() {
            thisvue = this;
            ajaxcall("https://viaa.zendesk.com/api/v2/help_center/categories.json", function(err, result) {
                if(err) {
                     thisvue.errormessage = err;
                }
                else {
                    thisvue.zendesk = result;
  
                }
            });
        }
    });
})();

