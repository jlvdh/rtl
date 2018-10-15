"use strict"
const request = require('request-promise');
const Series = require('../models/series');
const Cast = require('../models/cast');

const seriesEndpoint = "http://api.tvmaze.com/shows/"

const seriesScraper = {
    fetchAll: function () {
        this.increment += 1

        Promise.all([request(seriesEndpoint + this.increment), request(seriesEndpoint + this.increment + '/cast')])
            .then((response) => {
                const series = JSON.parse(response[0])
                const cast = JSON.parse(response[1])
                console.log(series.id + " - " + series.name)
                new Series({
                        name: series.name,
                        tvMazeId: series.id
                    })
                    .save()
                    .then((series) => {
                        const attachCast = []
                        for (let i = 0; i < cast.length; i++) {

                            new Cast({
                                    name: cast[i].person.name,
                                    tvMazeId: cast[i].person.id,
                                    birthdate: new Date(cast[i].person.birthday)
                                })
                                .save() //should be upsert
                                .then(cast => {
                                    attachCast.push(series.cast().attach(cast))
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        }
                        return Promise.all(attachCast);
                    })
                    .catch(err => {
                        console.log(err);
                    })

            })
            .then(() => {
                setTimeout(() => {
                    this.fetchAll()
                }, 500)
            })
            .catch(err => {
                if (err.statusCode === 404) {
                    // skip 
                    setTimeout(() => {
                        this.fetchAll()
                    }, 1000)
                }
                if (err.statusCode === 429) {
                    // hitting rate limit, pausing 10 seconds before continuing with same show
                    this.increment -= 1
                    setTimeout(() => {
                        this.fetchAll()
                    }, 10000)
                }
                console.log(err);
            })
    },
    increment: 0
}

module.exports = seriesScraper

// infinte loop incrementing the id's
// when http rate limit error wait
// save series to db

// similar loop going through cast
// save related cast