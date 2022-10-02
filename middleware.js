let jwt = require("jsonwebtoken");
const config = require("./config");


let checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    console.log(token);

    if (token.startWith("Bearer ")) {
        // remove 'Bearer ' from token
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Token is not valid"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: "Auth token is not supplied"
        });
    }
};

let createToken = (username) => {
    
    let token = jwt.sign({ usename: username },
        config.secret,
        { expiresIn: "24h" }
    );

    return token;
};


module.exports = {
    checkToken: checkToken,
    createToken: createToken
};