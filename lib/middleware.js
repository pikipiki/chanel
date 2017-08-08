import { slackParser }  from '../lib/parser'

// export function Auth(req, res, next) => {
//     const data = slackParser(req.body);

    // if (data.token != config.slackToken) {
    //     res.status(401).json({
    //         text: "Sorry " + data.userName + ", i can't tell you nothing...",
    //         response_type: "ephemeral",
    //         attachments: [
    //             {
    //                 color: colors.red,
    //                 text: "Bad token sent"
    //             }
    //         ]
    //     })
    // } else {
    //     next();
    // }
//
//     next();
// }