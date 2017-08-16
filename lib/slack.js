'use strict';
import Constants from '../config/constants.json'

export function slackParser(body){
    return {
        teamID: body.team_id !== undefined ? body.team_id : undefined,
        channelID: body.channel_id !== undefined ? body.channel_id : undefined,
        channelName: body.channel_name !== undefined ? body.channel_name : undefined,
        userID: body.user_id !== undefined ? body.user_id : undefined,
        userName: body.user_name !== undefined ? body.user_name : undefined,
        text: body.text !== undefined ? body.text.replace(/(?:\r\n|\r|\n)/g, ' ').split(' ') : undefined,
        responseUrl: body.response_url !== undefined ? body.response_url : undefined
    };
}

class Formatter{
    constructor(){
        this.payload = {
            text: '',
            response_type: '',
            attachments: []
        };
    }

    setText(text){
        this.payload.text = text;
    }

    isTemporary(bool){
            this.payload.response_type = bool ? Constants.slack.temporaryType : '';
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