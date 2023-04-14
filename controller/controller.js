const node1 = require('../models/db');

const controller = {
    getIndex: function (req, res) {

        //find SELECT * FROM movies;
        //store result in movies

        movies = [
            {
            id: 1,
            title: "Everything Everywhere All At Once",
            year: 2022,
            genre: "Sci-fi",
            director: "Daniel Kwan",
            actor: "Michelle Yeoh"
            },
            {
                id: 2,
                title: "The Super Mario Bros. Movie",
                year: 2023,
                genre: "Adventure",
                director: "Aaron Horvath",
                actor: "Chris Pratt"
            },
            {
                id: 3,
                title: "SP02 Ricardo Dalisay",
                year: 2023,
                genre: "Action",
                director: "Matthew Sy",
                actor: "Andres Dalisay"
            },

            
    ]
        res.render('index', {movies})
    },

    testQuery: async function (req, res) {
        const [rows, fields] = await node1.promise().query(`SELECT * FROM movies`);
        res.send(rows);
    }
}

module.exports = controller;