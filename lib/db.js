import orm from 'orm'
import env from '../config/env.json'

export default (app) => {
    let promise = new Promise((resolve, reject) => {
        orm.connect(`${env[app.settings.env].db.driver}://${env[app.settings.env].db.user}:${env[app.settings.env].db.pwd}@${env[app.settings.env].db.host}/${env[app.settings.env].db.name}`, function (err, db) {
            if (err) throw err;

            // Define database
            let models = {
                teams: db.define("teams", {
                    slack_id        : String,
                    slack_name      : String,
                    slack_token     : String,
                    updated_at      : Date,
                    created_at      : Date
                }),
                configurations : db.define("configurations", {
                    slack_team_id   : String,
                    channel_id      : String,
                    domain          : ['production', 'staging'],
                    action          : ['invalidate', 'remove'],
                    user            : String,
                    password        : String,
                    updated_at      : Date,
                    created_at      : Date
                }),
                targets : db.define("targets", {
                    team_id         : String,
                    type            : ['arl', 'cpcode'],
                    value           : String,
                    updated_at      : Date,
                    created_at      : Date
                })

            };

            // add the table to the database
            db.sync(function(err) {
                resolve(models);
            });
        })
    });

    promise.then((models) => {
        app.set("models", models);
        // console.log(models);
        // models.teams.find({ slack_token: "toto" }, function (err, people) {
        //     // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
        //     if (err) throw err;
        //
        //     console.log("People found: %d", people.length);
        //
        //     people[0].slack_name = "test";
        //     people[0].save(function (err) {
        //         // err.msg = "under-age";
        //     });
        // });
    });
}