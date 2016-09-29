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
            skryvUitvoerder: "",
            skryvBriefingTitel: "",
            skryvMediaIds: "",
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
            validate: function() {
                var briefing_id = $('#briefing_id').val();
                var self = this;

                $.post({
                        url: '/api/briefings/validate',
                        //timeout: 3000 // 3 seconds
                        }, 
                        {briefing_id: briefing_id}
                        ).done(function(data) {
                            $('.error').empty();
                            self.skryvUitvoerder = data.data.uitvoerder;
                            self.skryvBriefingTitel = data.data.briefing_titel;
                            self.skryvMediaIds = data.data.media_ids;
                            $('.skryvOutcome').css("visibility", 'visible');
                            $('.submitbtn').css("visibility", 'visible');
                        })
                        .fail(function() {
                            $('.error').text('Briefing ID niet gevonden in Skryv.');
                        });
            },
            startFetch: function() {
                var postobj = {
                    briefing_id: $('#briefing_id').val(),
                    briefing_titel: this.skryvBriefingTitel,
                    uitvoerder: this.skryvUitvoerder,
                    media_ids: this.skryvMediaIds
                };
                console.log(postobj);
                $.post('/api/briefings/', postobj);
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
