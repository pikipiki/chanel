'use strict';
import Constants from '../config/constants'
import colors from '../config/colors'
import validator from 'validator'
import { akamaiHelper } from '../lib/akamai'
import dateFormat from 'dateformat'

function slackParser(body){
    return {
        token: body.token !== undefined ? body.token : undefined,
        teamID: body.team_id !== undefined ? body.team_id : undefined,
        channelID: body.channel_id !== undefined ? body.channel_id : undefined,
        channelName: body.channel_name !== undefined ? body.channel_name : undefined,
        userID: body.user_id !== undefined ? body.user_id : undefined,
        userName: body.user_name !== undefined ? body.user_name : undefined,
        text: body.text !== undefined ? body.text.replace(/(?:\r\n|\r|\n)/g, ' ').split(' ') : undefined,
        responseUrl: body.response_url !== undefined ? body.response_url : undefined
    };
}

class slackFormatter{
    constructor() {
        this.payload = {
            text: '',
            response_type: '',
            attachments: []
        };
    }

    setText(text) {
        this.payload.text = text;
    }

    isTemporary(bool) {
            this.payload.response_type = bool ? Constants.slack.temporaryType : 'in_channel';
    }

    addAttachment(color, title, text, fields){
        let attach = {
            color: title !== undefined && color != null ? color : '',
            title: title !== undefined && title != null ? title : '',
            text: text !== undefined && text != null ? text : '',
            fields: fields !== undefined && fields != null ? fields : {},
        };

        this.payload.attachments.push(attach)
    }

    getPayload() {
        return this.payload;
    }
}

class slackCommands{
    constructor(db, teamID) {
        this.args = null;
        this.db = db;
        this.teamID = teamID;
    }

    setArgs(args) {
        this.args = args;
    }

    flushUrl(resolve){
        const data = [];
        const akamai = new akamaiHelper(this.db);
        const formatter = new slackFormatter();

        for(let i = 0; i < this.args.length; i++) {
            let tmp =this.args[i].replace("<", "").replace(">", "");
            if (validator.isURL(tmp))
                data.push(tmp);
        }

        let promise = new Promise((resolve, reject) => {
            akamai.flush(this.teamID, 'arl', data, resolve);
        });

        promise.then((res) => {
            if (!res.success) {
                formatter.setText(res.message);
                formatter.isTemporary(true);
            }
            else {
                const date = dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss");

                formatter.setText(`The urls has been flushed`);
                formatter.isTemporary(false);
                formatter.addAttachment(colors.green, null, null, [
                    {
                        title: `Purge ID`,
                        value: res.body.purgeId,
                        short: false
                    },
                    {
                        title: `Estimated time`,
                        value: `${(res.body.estimatedSeconds / 60)} minutes`,
                        short: false
                    },
                    {
                        title: `Date of the request`,
                        value: date,
                        short: false
                    },
                    {
                        title: `Urls flushed`,
                        value: data.join("\n"),
                        short: false
                    }
                ]);
            }

            resolve({
                status: res.status,
                message: formatter.getPayload()
            });
        });
    }

    flushCpCodes(resolve){
        const akamai = new akamaiHelper(this.db);
        const formatter = new slackFormatter();

        let promise = new Promise((resolve, reject) => {
            akamai.flush(this.teamID, 'cpcode', this.args, resolve);
        });

        promise.then((res) => {
            if (!res.success) {
                formatter.setText(res.message);
                formatter.isTemporary(true);
            }
            else {
                const date = dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss");

                formatter.setText(`The urls has been flushed`);
                formatter.isTemporary(false);
                formatter.addAttachment(colors.green, null, null, [
                    {
                        title: `Purge ID`,
                        value: res.body.purgeId,
                        short: false
                    },
                    {
                        title: `Estimated time`,
                        value: `${(res.body.estimatedSeconds / 60)} minutes`,
                        short: false
                    },
                    {
                        title: `Date of the request`,
                        value: date,
                        short: false
                    },
                    {
                        title: `Urls flushed`,
                        value: this.args.join("\n"),
                        short: false
                    }
                ]);
            }

            resolve({
                status: res.status,
                message: formatter.getPayload()
            });
        });
    }

    queue(resolve){
        const akamai = new akamaiHelper(this.db);
        const formatter = new slackFormatter();

        let promise = new Promise((resolve, reject) => {
            akamai.queue(this.teamID, resolve);
        });

        promise.then((res) => {
            if (!res.success) {
                formatter.setText(res.message);
                formatter.isTemporary(true);
            }
            else {
                const date = dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss");

                formatter.setText(`The urls has been flushed`);
                formatter.isTemporary(false);
                formatter.addAttachment(colors.green, null, null, [
                    {
                        title: `Length of the queue`,
                        value: res.body.queueLength,
                        short: false
                    },
                    {
                        title: `Date of the request`,
                        value: date,
                        short: false
                    }
                ]);
            }

            resolve({
                status: res.status,
                message: formatter.getPayload()
            });
        });
    }

    purgeStatus(resolve){
        const akamai = new akamaiHelper(this.db);
        const formatter = new slackFormatter();

        if (this.args.length !== 1){
            formatter.setText(this.args.length > 0 ? `You can only ask for one purge ID at a time` : `You need to give me a purge ID`);
            formatter.isTemporary(true);
            resolve({
                status: 403,
                message: formatter.getPayload()
            });
            return false;
        }

        let promise = new Promise((resolve, reject) => {
            akamai.purgeStatus(this.teamID, this.args[0], resolve);
        });

        promise.then((res) => {
            if (!res.success) {
                formatter.setText(res.message);
                formatter.isTemporary(true);
            }
            else {
                const date = dateFormat(new Date(), "dd/mm/yyyy - HH:MM:ss");

                formatter.setText(`The urls has been flushed`);
                formatter.isTemporary(false);
                formatter.addAttachment(colors.green, null, null, [
                    {
                        title: `Purge ID`,
                        value: res.body.purgeId,
                        short: false
                    },
                    {
                        title: `Status of the purge`,
                        value: res.body.purgeStatus,
                        short: false
                    },
                    {
                        title: `Date of the request`,
                        value: res.body.submissionTime,
                        short: false
                    }
                ]);
            }

            resolve({
                status: res.status,
                message: formatter.getPayload()
            });
        });
    }

    help(resolve){
        const formatter = new slackFormatter();

        formatter.setText(`Don't worry, i'm here to help`);
        formatter.isTemporary(false);
        formatter.addAttachment(colors.green, null, null, [
            {
                title: `Flush a URL`,
                value: `flush-url http://example.com`,
                short: false
            },
            {
                title: `Flush a cpcode`,
                value: `flush-code 520036`,
                short: false
            },
            {
                title: `Check the queue`,
                value: `queue`,
                short: false
            },
            {
                title: `Check the status of a purge ID`,
                value: `purge <purgeID>`,
                short: false
            },
            {
                title: `Set the credentials to Akamai`,
                value: `login username password`,
                short: false
            },
            {
                title: `Set a cron`,
                value: `cron minutes command`,
                short: false
            },
            {
                title: `Set the flush settings`,
                value: `settings invalidate|remove staging|production`,
                short: false
            },
            {
                title: `Get the status of the bot`,
                value: `status`,
                short: false
            },
        ]);

        resolve({
            status: 200,
            message: formatter.getPayload()
        });
    }

    cron(resolve){
        const formatter = new slackFormatter();
        const db = this.db;
        const teamID = this.teamID;

        if (this.args.length < 2) {
            formatter.setText(`You need to set the schedule time in minutes and then the command: /flush-gordon cron 60 queue`);
            formatter.isTemporary(true);

            resolve({
                status: 403,
                message: formatter.getPayload()
            });
        }

        const schedule = this.args[0] !== undefined ? this.args[0] : 0;
        let command = null;

        if (this.args[1] !== undefined) {
            this.args.shift();
            command = this.args.join(' ');
        }

        const promise = new Promise((resolve, reject) => {
            this.db.crons.find({ team_id: this.teamID }, function (err, cron) {
                if (err) throw err;

                if (cron.length === 0) {
                    const newRecord = {
                        team_id: teamID,
                        schedule: schedule,
                        command: command
                    };
                    db.crons.create(newRecord, function(err, results) {
                        if (err) throw err;

                        resolve({
                            success: true
                        })
                    });
                }
                else {
                    cron[0].command = command;
                    cron[0].schedule = schedule;
                    cron[0].save(function (err) {
                        if (err) throw err;

                        resolve({
                            success: true
                        })
                    });
                }
            });
        });

        promise.then(() => {
            formatter.setText(`The cron has been set`);
            formatter.isTemporary(true);

            resolve({
                status: 200,
                message: formatter.getPayload()
            });
        });
    }

    login(resolve){
        const formatter = new slackFormatter();

        if (this.args.length !== 2) {
            formatter.setText(`You need to give the username and password: /flush-gordon login username password`);
            formatter.isTemporary(true);

            resolve({
                status: 403,
                message: formatter.getPayload()
            });
        }

        const username = this.args[0] !== undefined ? this.args[0] : null;
        const password = this.args[1] !== undefined ? this.args[1] : null;

        const promise = new Promise((resolve, reject) => {
            this.db.configurations.find({ team_id: this.teamID }, function (err, config) {
                if (err) throw err;

                config[0].user = username;
                config[0].password = password;
                config[0].save(function (err) {
                    if (err) throw err;

                    resolve({
                        success: true
                    })
                });
            });
        });

        promise.then(() => {
            formatter.setText(`The credentials has been set`);
            formatter.isTemporary(true);

            resolve({
                status: 200,
                message: formatter.getPayload()
            });
        });
    }

    settings(resolve){
        const formatter = new slackFormatter();

        if (this.args.length !== 2) {
            formatter.setText(`You need to give the type of flush and the target: /flush-gordon settings invalidate|remove staging|production`);
            formatter.isTemporary(true);

            resolve({
                status: 403,
                message: formatter.getPayload()
            });
        }

        const type = this.args[0] !== undefined ? this.args[0] : null;
        const target = this.args[1] !== undefined ? this.args[1] : null;

        if ([`invalidate`, `remove`].indexOf(type) === -1) {
            formatter.setText(`The type of flush must be invalidate or remove`);
            formatter.isTemporary(true);

            resolve({
                status: 403,
                message: formatter.getPayload()
            });

            return false;
        }
        if ([`staging`, `production`].indexOf(target) === -1) {
            formatter.setText(`The target domain must be production or staging`);
            formatter.isTemporary(true);

            resolve({
                status: 403,
                message: formatter.getPayload()
            });

            return false;
        }

        const promise = new Promise((resolve, reject) => {
            this.db.configurations.find({ team_id: this.teamID }, function (err, config) {
                if (err) throw err;

                config[0].domain = target;
                config[0].action = type;
                config[0].save(function (err) {
                    if (err) throw err;

                    resolve({
                        success: true
                    })
                });
            });
        });

        promise.then(() => {
            formatter.setText(`The settings has been set`);
            formatter.isTemporary(true);

            resolve({
                status: 200,
                message: formatter.getPayload()
            });
        });
    }

    status(resolve){
        const formatter = new slackFormatter();
        const promises = [];

        promises.push(
            new Promise((resolve, reject) => {
                this.db.configurations.find({ team_id: this.teamID }, function (err, config) {
                    if (err) throw err;

                    resolve([
                        {
                            title: `The target domain`,
                            value: config[0].domain,
                            short: false
                        },
                        {
                            title: `The type of flush`,
                            value: config[0].action,
                            short: false
                        },
                        {
                            title: `Are credentials set ?`,
                            value: (config[0].user !== null && config[0].password !== null ? `Yes` : `No`),
                            short: false
                        }
                    ]);
                });
            })
        );

        promises.push(
            new Promise((resolve, reject) => {
                this.db.crons.find({ team_id: this.teamID }, function (err, cron) {
                    if (err) throw err;

                    resolve([
                        {
                            title: `The command of the cron`,
                            value: cron[0].command,
                            short: false
                        },
                        {
                            title: `The schedule of the cron`,
                            value: `Every ${cron[0].schedule} minutes`,
                            short: false
                        }
                    ]);
                });
            })
        );

        Promise.all(promises).then((data) => {
            formatter.setText(`Your configuration is`);
            formatter.isTemporary(true);

            for(let i = 0; i < data.length; i++) {
                formatter.addAttachment(colors.green, null, null, data[i]);
            }
            resolve({
                status: 200,
                message: formatter.getPayload()
            });
        });
    }
}

export {
    slackParser,
    slackFormatter,
    slackCommands
}