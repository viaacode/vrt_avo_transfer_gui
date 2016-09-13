$(document).ready(function () {
    // API endpoint
    // http://localhost:1234/api/briefings

    var runningAjaxCalls = [];
    var mediaIdsDelimiter = ',';

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
            toggleContent: function(e) {
                $(e.target).closest('.briefingItem').find('.briefing_content').toggle(150);
            },
            showAddItemContent: function() {
                $('.addItem-content').show(300);
                $('.addItem-icon').hide(300);
            },
            // Toast for if we would not redirect to other page
            submitAddItem: function() {
                $('.addItem-content').hide(300);
                $('.addItem-icon').show(300);

                $('.toast').text('Item toegevoegd');
                $('.toast').slideDown(300).delay(3000).slideUp(300);
            },
            addMediaId: function() {
                var val = $('.mediaIdValue').val();
                $('.media-ids-added').append('<span>' + val + '</span>');

                // Add to hidden field for POST request
                if($('#mediaIds').val() === '') $('#mediaIds').val(val);    // If first item, don't add delimiter in front of it
                else $('#mediaIds').val($('#mediaIds').val() + mediaIdsDelimiter + val);
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
