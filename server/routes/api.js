var moment = require('moment');

var jsend = require('../util/jsend');

module.exports = function (router, config, request) {
    router.get('/api/briefings/:id?', briefings);
    router.post('/api/briefings/add', addbriefing);

    function addbriefing(req, res, next) {
        var briefing_id = req.body.briefing_id;
        var email = req.body.email;

        console.log(req.body);
        console.log("post received: " + briefing_id + ", "  + email);

        res
            .append('Content-Type', 'application/json')
            .send(jsend.success());
    }

    function briefings(req, res, next) {
        if (!req.params.id) req.params.id = '';
        var url = config.muleHost + '/briefings/' + req.params.id;

        debugger;
        //forwardRequestCall(url, res, next);

        var data = {
            "briefings": [
                {
                    "briefing_id": "briefing 1",
                    "briefing_title": "Beeldmateriaal test",
                    "reception_date": "2016-08-25T10:52:37",
                    "media_ids": [
                        {
                            "media_id": "AIM10022093",
                            "media_type": "video",
                            "status": "QUEUED",
                            "email": "brecht.vandevyvere@viaa.be",
                            "retry_count": null,
                        },
                        {
                            "media_id": "AIM10022093",
                            "media_type": "video",
                            "status": "REQUESTED",
                            "email": "hendrik@viaa.be",
                            "retry_count": null,
                        }]
                },
                {
                    "briefing_id": "briefing 2",
                    "briefing_title": "Beeldmateriaal test",
                    "reception_date": "2016-08-25T10:52:37",
                    "media_ids": [
                        {
                            "media_id": "AIM10022093",
                            "media_type": "video",
                            "status": "QUEUED",
                            "email": "brecht.vandevyvere@viaa.be",
                            "retry_count": null,
                        }]
                }]
        };




        // {
        //     "briefing123": [
        //       {
        //         "briefing_title": "Beeldmateriaal test",
        //         "media_type": "video",
        //         "retry_count": null,
        //         "media_id": "AIM10022093",
        //         "briefing_id": "briefing123",
        //         "email": "brecht.vandevyvere@viaa.be",
        //         "status": "QUEUED",
        //         "reception_date": "2016-08-25T10:52:37",
        //         "id": 2
        //       },
        //       {
        //         "briefing_title": "Beeldmateriaal test",
        //         "media_type": "audio",
        //         "retry_count": null,
        //         "media_id": "AIM10022092",
        //         "briefing_id": "briefing123",
        //         "email": "brecht.vandevyvere@viaa.be",
        //         "status": "REQUESTED",
        //         "reception_date": "2016-08-25T10:52:37",
        //         "id": 3
        //       }
        //     ]
        //   },
        //   {
        //     "briefing456": [
        //       {
        //         "briefing_title": "joo",
        //         "media_type": "video",
        //         "retry_count": null,
        //         "media_id": "AIM1002",
        //         "briefing_id": "briefing456",
        //         "email": "brecht.vandevyvere@viaa.be",
        //         "status": "RECONCILED",
        //         "reception_date": "2016-08-25T10:52:37",
        //         "id": 4
        //       }
        //     ]
        //   }];

        res
            .append('Content-Type', 'application/json')
            .send(jsend.success(data));
    }

    function forwardRequestCall(url, res, next, parse) {
        console.log('executing forwardRequestCall(' + url + ')');
        request(url, function (error, response, body) {
            if (error) return next(error);
            if (response.statusCode != 200) return next(jsend.error(response.statusCode, error));

            if (typeof body === 'string') {
                body = JSON.parse(body);
            }

            data = parse ? parse(body) : body;

            res
                .append('Content-Type', 'application/json')
                .send(jsend.success(data));
        });
    }
};
