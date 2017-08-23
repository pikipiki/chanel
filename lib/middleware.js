'use strict';
import { slackParser, slackFormatter }  from './slack'
import colors from '../config/colors'

function isAuth(req, res, next) {
    const data = slackParser(req.body);
    const db = req.app.settings.db;
    const format = new slackFormatter();

    let promise = new Promise((resolve, reject) => {
        db.configurations.find({ token: data.token, team_id: data.teamID }, function (err, config) {
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
                format.addAttachment(colors.red, null, 'Bad credentials', null);
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