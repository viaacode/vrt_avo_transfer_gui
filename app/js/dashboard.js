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
            // Toast for if we would not redirect to other page
            submitAddItem: function() {
                $('.addItem-content').hide(300);
                $('.addItem-icon').show(300);

                $('.toast').text('Item toegevoegd');
                $('.toast').slideDown(300).delay(3000).slideUp(300);            
            },
            addMediaId: function(val) {
               // var val = $('.mediaIdValue').val();
                $('.media-ids-added').append('<span>' + val + '</span>');

                // Add to hidden field for POST request
                if($('#media_ids').val() === '') $('#media_ids').val(val);    // If first item, don't add delimiter in front of it
                else $('#media_ids').val($('#media_ids').val() + mediaIdsDelimiter + val);

                // UX: empty input field text and refocus
                $('.mediaIdValue').val('').focus();

            },
            addItem: function() {
                $.post('/api/briefings/', { 
                    briefing_id: 'yo',
                    email: 'email',
                    media_ids: 'test,ja,nee',
                 });
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
