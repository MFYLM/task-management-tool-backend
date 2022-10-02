const express = require("express");

const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;


// get all records
recordRoutes.route("/record").post(function (req, res) {
    let db_connect = dbo.getDb();
    let email = req.body.email;

    db_connect.collection("ProjectList").find({}).toArray(function (err, result) {
        if (err) throw err;
        const projectArray = [];

        for (let i = 0; i < result.length; ++i) {
            for (let j = 0; j < result[i].collaborators.length; ++j) {

                if (result[i].collaborators[j].email === email) {
                    projectArray.push(result[i]);
                }
            }
        }

        res.json(projectArray);
    });
});


// find one record based on id
recordRoutes.route("/record/:id").get((req, res) => {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId( req.params.id ) };
    db_connect.collection("ProjectList").findOne(query, (err, project) => {
        if (err) throw err;
        res.json(project);
    });
});


recordRoutes.route("/record/add").post((req, res) => {
    let db_connect = dbo.getDb();
    let newObject = {
        name: req.body.name,
        leader: req.body.leader,
        collaborators: req.body.collaborators,
        description: req.body.description,
        tasks: req.body.tasks
    };

    db_connect.collection("ProjectList").insertOne(newObject, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/update/:id").post((req, res) => {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId( req.params.id ) };
    // FIXME: converting from id to ObjectId --> cause error            id is already in objectId format, so no need to convert it again

    let newValues = {
        $set: {
            name: req.body.name,
            leader: req.body.leader,
            description: req.body.description,
            collaborators: req.body.collaborators
        }
    };

    db_connect.collection("ProjectList").updateOne(query, newValues, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/delete/:id").delete((req, res) => {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId( req.params.id ) };

    db_connect.collection("ProjectList").deleteOne(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/:projectId/task/update").post((req, res) => {

    let db_connect = dbo.getDb();
    let query = { _id: ObjectId( req.params.projectId ) }
    let newValues = {
        $set : {
            tasks: req.body.tasks
        }
    };

    db_connect.collection("ProjectList").updateOne(query, newValues, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


module.exports = recordRoutes;
