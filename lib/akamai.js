'use strict';
import Constants from '../config/constants'
import request from 'request'

class akamaiHelper{
    constructor(db){
        this.db = db;
    }

    flush(teamID, type, data, globalResolve) {
        let promise = new Promise((resolve, reject) => {
            this.db.configurations.find({ team_id: teamID }, function (err, config) {
                const options = {
                    uri: Constants.akamai.flushUrl,
                    method: 'POST',
                    json: {
                        domain: config[0].domain,
                        action: config[0].action,
                        type: type,
                        objects : data
                    },
                    auth: {
                        "user": config[0].user,
                        "pass": config[0].password
                    }
                };

                request(options, function (err, res, body) {
                    const data = {
                        success: false,
                        status: res.statusCode
                    };
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        data.success = true;
                        data.body = body;
                    }
                    else if (res.statusCode === 401) {
                        data.message = `It's seems that your credentials are wrong`;
                    }
                    else {
                        data.message = `The error ${res.statusMessage} was returned by Akamai`;
                    }

                    resolve(data);
                });
            });
        });

        promise.then((res) => {
            globalResolve(res);
        });
    }

    queue(teamID, globalResolve) {
        let promise = new Promise((resolve, reject) => {
            this.db.configurations.find({ team_id: teamID }, function (err, config) {
                const options = {
                    uri: Constants.akamai.flushUrl,
                    method: 'GET',
                    auth: {
                        "user": config[0].user,
                        "pass": config[0].password
                    }
                };

                request(options, function (err, res, body) {
                    const data = {
                        success: false,
                        status: res.statusCode
                    };

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        data.success = true;
                        data.body = JSON.parse(body);
                    }
                    else if (res.statusCode === 401) {
                        data.message = `It's seems that your credentials are wrong`;
                    }
                    else {
                        data.message = `The error ${res.statusMessage} was returned by Akamai`;
                    }

                    resolve(data);
                });
            });
        });

        promise.then((res) => {
            globalResolve(res);
        });
    }

    purgeStatus(teamID, purgeID, globalResolve) {
        let promise = new Promise((resolve, reject) => {
            this.db.configurations.find({ team_id: teamID }, function (err, config) {
                const options = {
                    uri: Constants.akamai.purgeStatusUrl.replace(`{purgeID}`, purgeID),
                    method: 'GET',
                    auth: {
                        "user": config[0].user,
                        "pass": config[0].password
                    }
                };

                request(options, function (err, res, body) {
                    const data = {
                        success: false,
                        status: res.statusCode
                    };

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        data.success = true;
                        data.body = JSON.parse(body);
                    }
                    else if (res.statusCode === 401) {
                        data.message = `It's seems that your credentials are wrong`;
                    }
                    else {
                        data.message = `The error ${res.statusMessage} was returned by Akamai`;
                    }

                    resolve(data);
                });
            });
        });

        promise.then((res) => {
            globalResolve(res);
        });
    }
}

export {
    akamaiHelper
}