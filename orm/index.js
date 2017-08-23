import orm from 'orm'

export default () => {
    let promise = new Promise((resolve, reject) => {
        orm.connect("mysql://root:@localhost/flush_gordon", function (err, db) {
            if (err) throw err;

            // Define database
            let Teams = db.define("teams", {
                slack_id        : String,
                slack_name      : String,
                slack_token     : String,
                updated_at      : Date,
                created_at      : Date
            });

            // Define database
            let Configurations = db.define("configurations", {
                slack_team_id   : String,
                channel_id      : String,
                domain          : ['production', 'staging'],
                action          : ['invalidate', 'remove'],
                user            : String,
                password        : String,
                updated_at      : Date,
                created_at      : Date
            });

            // Define database
            let Targets = db.define("targets", {
                team_id         : String,
                type            : ['arl', 'cpcode'],
                value           : String,
                updated_at      : Date,
                created_at      : Date
            });

            // add the table to the database
            db.sync(function(err) {
                resolve("Db sync");
                // if (err) throw err;
                //
                // // add a row to the person table
                // Person.create({ id: 1, name: "John", surname: "Doe", age: 27 }, function(err) {
                //     if (err) throw err;
                //
                //     // query the person table by surname
                //     Person.find({ surname: "Doe" }, function (err, people) {
                //         // SQL: "SELECT * FROM person WHERE surname = 'Doe'"
                //         if (err) throw err;
                //
                //         console.log("People found: %d", people.length);
                //         console.log("First person: %s, age %d", people[0].fullName(), people[0].age);
                //
                //         people[0].age = 16;
                //         people[0].save(function (err) {
                //             // err.msg = "under-age";
                //         });
                //     });
                //
                // });
            });
        })
    });
}