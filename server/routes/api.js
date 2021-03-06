var moment = require('moment');

var jsend = require('../util/jsend');

module.exports = function (router, config, request) {
    router.get('/api/briefings/:id?', getBriefings);
    router.post('/api/briefings', addBriefing);
    router.post('/api/briefings/validate', validateBriefing);


    function addBriefing(req, res, next) {
        var obj = JSON.parse(Object.keys(req.body)[0]);

        var briefing_id = obj.briefing_id;
        var briefing_titel = obj.briefing_titel;
        var uitvoerder = obj.uitvoerder;
        var toegevoegd_door = obj.toegevoegd_door;
        var media_ids = obj.media_ids;
        var viaa_pids = obj.viaa_pids;

        console.log("post received: " + briefing_id + ", "  + briefing_titel + ", " + uitvoerder);
        console.log("Media ids:");
        for(var i = 0; i < media_ids.length; i++) {
            console.log(media_ids[i].media_id + ' [' + media_ids[i].media_type + ']');
        }
        console.log("VIAA PIDs:");
        for(var i = 0; i < viaa_pids.length; i++) {
            console.log(viaa_pids[i].pid + ' [' + viaa_pids[i].media_type + ']');
        }

        // briefing verzenden naar mule API
        var url = config.muleHost + '/briefings/' + briefing_id;

        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/json',
        }

        var obj = {
                "briefing_id" : briefing_id,
                "briefing_titel" : briefing_titel,
                "uitvoerder" :  uitvoerder,
                "toegevoegd_door" : toegevoegd_door,
                "media_ids" : media_ids,
                "viaa_pids": viaa_pids
            };

        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            json: obj
        }

        request(options, function (error, response, body) {
            if (body && body.code == 500) {
                res.
                    append('Content-Type', 'application/json')
                    .send(jsend.error(body.code, body.error));
            }
            else if (body && !error && response.statusCode == 200) {
                // Print out the response body
                res
                    .append('Content-Type', 'application/json')
                    .send(jsend.success(body));
            }
        });
    }

    function getBriefings(req, res, next) {
        if (!req.params.id) req.params.id = '';
        var url = config.muleHost + '/briefings/' + req.params.id;

        forwardRequestCall(url, res, next);

        // var data = {
        //     "briefings": [
        //         {
        //             "briefing_id": "briefing 1",
        //             "briefing_titel": "Beeldmateriaal test",
        //             "reception_date": "2016-08-25T10:52:37",
        //             "uitvoerder": "hendrik@viaa.be",
        //             "toegevoegd_door": "hendrik@viaa.be",
        //             "aantal_bezig": 2,
        //             "totaal": 2,
        //             "media_ids": [
        //                 {
        //                     "media_id": "AIM10022093",
        //                     "media_type": "video",
        //                     "status": "QUEUED",
        //                 },
        //                 {
        //                     "media_id": "AIM10022093",
        //                     "media_type": "video",
        //                     "status": "REQUESTED",
        //                 }]
        //         },
        //         {
        //             "briefing_id": "briefing 2",
        //             "briefing_titel": "Beeldmateriaal test",
        //             "uitvoerder": "brecht.vandevyvere@viaa.be",
        //             "toegevoegd_door": "brecht.vandevyvere@viaa.be",
        //             "reception_date": "2016-08-25T10:52:37",
        //             "aantal_bezig": 0,
        //             "totaal": 1,
        //             "media_ids": [
        //                 {
        //                     "media_id": "AIM10022093",
        //                     "media_type": "video",
        //                     "status": "COMPLETED",
        //                 }]
        //         }]
        // };
        // res
        //     .append('Content-Type', 'application/json')
        //     .send(jsend.success(data));
    }

    function validateBriefing(req, res, next) {
        var url = config.muleHost + '/briefings/validate';

        console.log('executing forwardRequestCall(' + url + ')');

        // Configure the request
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/json',
        }

        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            json: req.body
        }

        request(options, function (error, response, body) {
            if (body && body.code == 500) {
                res.
                    append('Content-Type', 'application/json')
                    .send(jsend.error(body.code, body.error));
            }
            else if (body && !error && response.statusCode == 200) {
                // Print out the response body
                res
                    .append('Content-Type', 'application/json')
                    .send(jsend.success(body));
            }
        })
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
