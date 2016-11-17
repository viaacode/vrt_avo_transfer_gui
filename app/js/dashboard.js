$(document).ready(function () {
    // API endpoint
    // http://localhost:1234/api/briefings

    jQuery.ajaxSettings.traditional = true; // to prevent jquery from adding '[]' to array keys in $.post object

    var runningAjaxCalls = [];
    var mediaIdsDelimiter = ',';
    var pidRegex = /^([A-Za-z0-9]{10})$/;
    var pidHolder = '';

    new Vue({
        el: '#briefingApp',
        data: {
            briefings: [],
            skryvUitvoerder: "",
            skryvBriefingTitel: "",
            skryvMediaIdsVideo: [],
            skryvMediaIdsAudio: []
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
                this.resetBriefingInput();
                var briefing_id = $('#briefing_id').val();
                var self = this;

                $.post({
                        url: '/api/briefings/validate',
                        //timeout: 3000 // 3 seconds
                        }, 
                        {briefing_id: briefing_id}
                        ).done(function(data) {
                            $('.error').empty();
                            $('.success').empty();
                            self.skryvUitvoerder = data.data.uitvoerder;
                            self.skryvBriefingId = data.data.briefing_id;
                            self.skryvBriefingTitel = data.data.briefing_titel;
                            self.skryvMediaIdsVideo = data.data.media_ids_video;
                            self.skryvMediaIdsAudio = data.data.media_ids_audio;
                            // Don't show button when no videos and no audios
                            if (self.skryvMediaIdsVideo.length > 0 || self.skryvMediaIdsAudio.length > 0) {
                                $('.submitbtn').css("visibility", 'visible');
                                $('.skryvOutcome').css("visibility", 'visible');
                            } else {
                                $('.error').text('Briefing bevat geen items');
                            }
                        })
                        .fail(function() {
                            $('.error').text('Briefing ID niet gevonden in Skryv.');
                        });
            },
            startFetch: function() {
                var self = this;

                var postobj = {
                    briefing_id: this.skryvBriefingId,
                    briefing_titel: this.skryvBriefingTitel,
                    uitvoerder: this.skryvUitvoerder,
                    toegevoegd_door: vat.username,
                    media_ids: this.skryvMediaIdsVideo.concat(this.skryvMediaIdsAudio)
                };
                console.log(postobj);
                $.post('/api/briefings/', JSON.stringify(postobj))
                    .done(function(data) {
                            $('.success').text('Briefing is gestart!');
                            self.resetBriefingInput();
                            refreshView(self);
                        })
                    .fail(function() {
                        $('.error').text('Mislukt om briefing toe te voegen. Contacteer @brechtvdv');
                    });
            },
            resetBriefingInput: function() {
                $('.skryvOutcome').css("visibility", 'hidden');
                $('.submitbtn').css("visibility", 'hidden');
                this.skryvUitvoerder = "";
                this.skryvBriefingTitel = "";
                this.skryvMediaIdsVideo = [];
                this.skryvMediaIdsAudio = [];
            },
            requestSubtitle: requestSubtitle
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

    $('#new_pid').on('blur', getPidInformation);
    $('#new_pid').on('input', getPidInformation);

    function getPidInformation() {
        var pid = $('#new_pid').val();
            if (pid != pidHolder) {
            pidHolder = pid;
            $('#starttime').val('');
            $('#endtime').val('');
            $('#subtitle-title').text('Onbekend');
            if (pidRegex.test(pid)) {
                var url = '/api/subtitles/' + pid;
                runningAjaxCalls.push(ajaxcall(url, function (err, result) {
                    if (err || result.status != 'OK') {
                        $('.error').text('Mislukt om informatie op te halen van deze PID. Controleer of deze bestaat');
                    }
                    else {
                        errors = [];
                        if (result.data.start_time) $('#starttime').val(result.data.start_time);
                        if (result.data.end_time) $('#endtime').val(result.data.end_time);
                        if (result.data.title) $('#subtitle-title').text(result.data.title);
                        $('.submitbtn').css("visibility", 'visible');
                        console.log('Result: ', result);
                    }
                }));
            }
        }
    }

    function requestSubtitle() {
        console.log('Requesting subtitle from Mule');
        var postobj =
        {
            new_pid: $('#new_pid').val(),
            mediamosa_id: $('#mediamosa_id').val(),
            starttime: $('#starttime').val(),
            endtime: $('#endtime').val(),
            email: $('#email').val()
        };
        console.log(postobj);
        $.post('/api/subtitles/', JSON.stringify(postobj))
            .done(function(data) {
                $('.success').text('Subtitle is opgevraagd!');
            })
            .fail(function() {
                $('.error').text('Mislukt om subtitle op te vragen. Contacteer @brechtvdv');
            });

    }

});
