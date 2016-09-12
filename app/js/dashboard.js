$(document).ready(function () {
    // API endpoint
    // http://localhost:1234/api/briefings

    var runningAjaxCalls = [];

    new Vue({
        el: '#briefingApp',
        data: {
            counter_media_ids: 0,
            errors: [],
            newBriefing: '',
            briefings: [],
            //  briefingIds: []
        },
        created: function () {
            refreshView(this);
            
        },
        methods: {
            addBriefing: function () {
                var text = this.newBriefing.trim();
                if (text) {
                    this.briefings.push({ text: text });
                    this.newBriefing = '';
                }
            },
            removeBriefing: function (index) {
                this.briefings.splice(index, 1);
            },
            addInput: function (divName) {
                var newdiv = document.createElement('div');
                newdiv.innerHTML = "<li>Entry " + (this.counter_media_ids + 1) + " <br><input type='text' name='myInputs[]'></li>";
                document.getElementById(divName).appendChild(newdiv);
            },
            toggleContent: function(e) {
                $(e.target).closest('.briefingItem').find('.briefing_content').toggle(150);
            },
            showAddItemContent: function() {
                $('.addItem-content').show(300);
            }
        }
    });

    // Refresh the whole view
    function refreshView(vueinstance) {
        // Read briefings
        runningAjaxCalls.push(ajaxcall("/api/briefings", function (err, result) {
            if (err) { vueinstance.errors.push(err); }
            else {
                errors = [];
                vueinstance.briefings = result.briefings;

            }
        }));        
    }



});
