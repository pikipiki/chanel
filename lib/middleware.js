'use strict';
import { slackParser, slackFormatter }  from './slack'
import colors from '../config/colors'
import constants from '../config/constants'

function isAuth(req, res, next) {
    const data = slackParser(req.body);
    const db = req.app.settings.db;
    const format = new slackFormatter();

    if (data.token !== constants.slack.token) {
        format.setText(`Sorry ${data.userName} you cannot access the service`);
        format.isTemporary(true);
        format.addAttachment(colors.red, null, 'Bad token', null);
        res.status(200).json(format.getPayload()); // Return 200 instead 401 because Slack won't display the response to te user
        return false;
    }

    let promise = new Promise((resolve, reject) => {
        db.configurations.find({ team_id: data.teamID }, function (err, config) {
            const resolvedData = {
                success: false
            };

            if (err) {
                format.setText(`Sorry ${data.userName} an error occurred, please try again`);
                format.isTemporary(true);
                format.addAttachment(colors.red, null, err.message, null);
                resolvedData.body = format.getPayload();
            }
            else if (config.length === 0) {
                format.setText(`Sorry ${data.userName} you cannot access the service`);
                format.isTemporary(true);
                format.addAttachment(colors.red, null, 'Team ID unknown', null);
                resolvedData.body = format.getPayload();
            }
            else {
                resolvedData.success = true;
            }

            resolve(resolvedData);
        });
    });

    promise.then((data) => {
        if (data.success)
            next();
        else
            res.status(200).json(data.body); // Return 200 instead 401 because Slack won't display the response to te user
    });
}

export {
    isAuth
}