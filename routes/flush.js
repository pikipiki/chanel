'use strict';
import express from 'express'
import { isAuth } from '../lib/middleware'
import { slackParser, slackFormatter, slackCommands }  from '../lib/slack'
import colors from '../config/colors'

const router =  express.Router();

router.post('/', isAuth, function(req, res) {
    const data = slackParser(req.body);
    const db = req.app.settings.db;
    const format = new slackFormatter();
    const commands = new slackCommands(req.app.settings.db, data.teamID);

    if (data.text === undefined || data.text.length === 0) {
        format.setText(`${data.userName} you need to give me args after the command`);
        format.isTemporary(true);
        format.addAttachment(colors.red, null, "/flush-gordon [commands] [args]", null);
        res.status(400).json(format.getPayload());
    }
    else {
        db.commands.find({ name: data.text[0], is_active: true }, function (err, command) {
            if (err) {
                format.setText(`Sorry ${data.userName} an error occurred, please try again`);
                format.isTemporary(true);
                format.addAttachment(colors.red, null, err.message, null);
                res.status(500).json(format.getPayload());

            }
            else if (command.length === 0 || commands[command[0].function] === undefined) {
                format.setText(`${data.userName} i'm not sure to really understand`);
                format.isTemporary(true);
                format.addAttachment(colors.red, null, `the command ${data.text[0]} doesn't exist`, null);
                res.status(400).json(format.getPayload());
            }
            else {
                data.text.shift(); // Remove the command from the args
                commands.setArgs(data.text);
                const promise = new Promise((resolve, reject) => {
                    commands[command[0].function](resolve);
                });

                promise.then((data) => {
                    res.status(data.status).json(data.message);
                });
            }
        });
    }
});

export default router;