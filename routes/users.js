const express = require("express");
const Users = express.Router();

const dbo = require("../db/conn");


Users.route("/users/login").post(async (req, res) => {
    let db_connect = dbo.getDb();

    const query = {
        username: req.body.usename,
        password: req.body.password
    };

    const result = await db_connect.collection("Users").find(query).toArray();
    res.json(result);
});


Users.route("/users/register").post((req, res) => {
    let db_connect = dbo.getDb();

    const newUser = {
        username: req.body.usename,
        password: req.body.password
    };

    db_connect.collection("Users").insertOne(newUser, (err, result) => {
        if (err) throw err;
        res.json(result);
    })
});


Users.route("/users/add").post((req, res) => {
    let db_connect = dbo.getDb();

    /*
    task:
    {
        description: "",
        date: [startDate, dueDate],
        status: "" or 0.0-1.0 ?
    }
    */

    const newTask = {
        projectId: req.body.projectId,
        owners: req.body.owners,
        task: req.body.task
    };

    db_connect.collection("Users").insertOne(newTask, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});



module.exports = Users;