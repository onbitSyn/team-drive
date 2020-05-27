const promise = require('bluebird');
const db = promise.promisifyAll(require('./db'));
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports ={
    x: (passport) => {
        //start of authentication strategy...
    
    passport.use(new localStrategy(
        function(username,password,done) {
           
            db.queryAsync("SELECT username,password FROM atithi WHERE username = $1",[username])
            .then(function(result){
                let data = result.rows;
                console.log(data);
                if(data.length === 0) {
                    return done(null,false);
                }
                console.log(data[0].password);
                console.log(data[0].password.length);        
                bcrypt.compare(password,data[0].password,function(err,match){
                    if (err) {
                        return done(null, false);
                    }
                    if (!match) {
                        return done(null, false, { message: "Password Doesn't Match" });
                    }
                    if (match) {
                        return done(null, data[0]);
                    }
                })
            })
    
            .catch(function(err){
                done(err);
            })
        }    
    ))
    //meaning storing a information in cookie to identify the user. 
    passport.serializeUser(function(user,cb){
        cb(null,user.username);
    })
    //meaning using a information store in the cookie to get more information about the user
    //and attaching the object of imformation with that user.
    passport.deserializeUser(function(username,cb) {
        db.queryAsync("SELECT username,email FROM atithi WHERE username=$1",[username])
        .then(function(result){
            cb(null,result.rows[0]);
        })
        .catch(function(err){
            cb(err);
        })
    })
    
    //end of authentication strategy..
    }
} 
    
    