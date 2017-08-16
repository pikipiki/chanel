'use strict';
import Constants from '../config/constants.json'
import akamai from 'akamai'

class Akamai{
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