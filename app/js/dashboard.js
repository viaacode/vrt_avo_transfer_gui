$(document).ready(function () {
    // API endpoint
    // http://localhost:1234/api/briefings

    jQuery.ajaxSettings.traditional = true; // to prevent jquery from adding '[]' to array keys in $.post object

    var runningAjaxCalls = [];
    var mediaIdsDelimiter = ',';

    new Vue({
        el: '#briefingApp',
        data: {
            counter_media_ids: 0,
            errors: [],
            briefings: [],
            objFromVrt: {},
            //  briefingIds: []
        },
        created: function () {
            refreshView(this);

        },
        methods: {
            toggleContent: function(e) {
                $(e.target).closest('.briefingItem').find('.briefing_content').toggle(150);
                $(e.target).closest('.briefingItem').find('.briefing_header').children().toggleClass('strong');
                $(e.target).closest('.briefingItem').find('.briefing_expand span').toggleClass('icon-down-open');
                $(e.target).closest('.briefingItem').find('.briefing_expand span').toggleClass('icon-up-open');

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
            startFetch: function() {
                var postobj = {
                    briefing_id: $('#briefing_id').val(),
                    briefing_title: $('#briefing_title').val(),
                    email: $('#email').val(),
                    media_ids: $('#media_ids').val().split(',')
                };

                $.post('/api/briefings/', postobj);

            },
            validate: function() {
                $.post('/api/briefings/validate', {
                    briefing_id: 'de id',

                }).done(function(data) {
                    console.log(data);
                    this.objFromVrt = data;
                });
            }
        },
        filters: {
            formatDate: function(date) {
                return moment(date).format('DD/MM/Y [om] h:mm:ss');
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

    // Search through every briefingItem its complete html (compare the lowercase to search box lowercase)
    // If matching -> show and expand the briefingItem; if not -> hide it
    $('#txt-search').keyup(function() {
        $('#briefingItemList .briefingItem').each(function() {
            if($(this).html().toLowerCase().indexOf($('#txt-search').val().toLowerCase()) >= 0) {
                $(this).show();
                $(this).find('.briefing_content').show();   // Expand all items that contain a match
            }
            else $(this).hide();

            // if($(this).is(':contains("' + $('#txt-search').val() + '")')) $(this).show();
            // else $(this).hide();
        });
    });

});
