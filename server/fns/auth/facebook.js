/* jshint camelcase: false */

(function() {
    'use strict';
    
    var request = require('request');
    
    
    var quickRequest = function(method, url, data, callback) {
        
        request[method](url, data, function(err, response, body) {
            if(err) {
                return callback(err);
            }
            if(!body) {
                return callback('No reply from auth url');
            }

            body = JSON.parse(body);

            if(body.error) {
                return callback('Auth token was not accepted: ' + JSON.stringify(body.error));
            }
            
            return callback(null, body);
        });
    };
    
    
    var self = {
        authenticate: function(data, callback) {
            
            /*if(data.code) {
                request.get('https://graph.facebook.com/oauth/access_token', {form: {
                    client_id: data.appId,
                    redirect_url: data.redirectUrl,
                    client_secret: data.appSecret,
                    code: data.codeParameter
                }}, function(err, response, body) {
                    
                    if(err) {
                        return callback(err);
                    }
                    if(!body) {
                        return callback('no reply from Facebook.com');
                    }

                    body = JSON.parse(body);

                    if(body.error) {
                        return callback('Facebook code was not accepted: ' + body.error);
                    }
                });
            }*/
            
            // confirm token
            quickRequest(
            'get',
            'https://graph.facebook.com/debug_token?input_token=' + data.accessToken + '&access_token=' + process.env.FUTURISM_FACEBOOK_APP_ID + '|' + process.env.FUTURISM_FACEBOOK_SECRET,
            {},
                
            function(err, body) {
                
                console.log('debug_token response', err, body);
                if(err) {
                    return callback(err);
                }
                if(!body.data.is_valid) {
                    return callback('Facebook token is not valid');
                }

                // get name
                quickRequest('get', 'https://graph.facebook.com/10203781379400079?access_token=' + data.accessToken, {}, function(err, body) {
                    
                    if(err) {
                        return callback(err);
                    }
                    var name = body.name;
                    var siteUserId = body.id;
                    
                    // return result
                    var verified = {
                        site: 'f',
                        name: name,
                        siteUserId: siteUserId,
                        avatar: 'https://graph.facebook.com/' + siteUserId + '/picture',
                        group: 'u',
                        beta: false
                    };
                    
                    return callback(err, verified);
                });
            });
        }
    };
    
    module.exports = self;
}());