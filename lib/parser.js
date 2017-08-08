'use strict';

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