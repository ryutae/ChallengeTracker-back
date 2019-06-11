// /challenge
const express = require('express')
const challengesRouter = express.Router()
const challengeController = require('./challenge.controller')
const ChallengesService = require('./challenges-service')
const jsonBodyParser = express.json()
const path = require('path')

challengesRouter
  .route('/all')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ChallengesService.getAllChallenges(knexInstance)
      .then(challenges => {
        res.status(200).json({
          data: challenges
        })
      })
      .catch(next)
  })

challengesRouter
  .route('/group/:group_id')
  .get((req, res, next) => {
    ChallengesService.getChallengesInGroup(req.app.get('db'), req.params.group_id)
    .then(challenges => {
      res.status(200).json({
        data: challenges
      })
    })
    .catch(next)
  })

challengesRouter
  .route('/:id')
  .get((req, res, next) => {
    const knexInstance =
    ChallengesService.getById(req.app.get('db'), req.params.id)
      .then(challenge => {
        res.status(200).json({
          data: challenge
        })
      })
  })
  .delete((req, res, next) => {
    ChallengesService.deletechallenge(req.app.get('db'), req.params.id)
      .then(challenge => res.status(200).json({data: challenge}))
  })

//client Admin only endpoint
challengesRouter
  .route('/create')
  .post(jsonBodyParser, (req, res, next) => {
    const { group_id, name, description, points } = req.body
    const newChallenge = { group_id, name, description, points }
    console.log(req.body)
    // for (const [key, value] of Object.entries(newChallenge))
    //   if (value == null)
    //     return res.status(400).json({
    //       error: `Missing '${key}' in request body`
    //     })
    ChallengesService.insertchallenge(req.app.get('db'), newChallenge)
    .then(challenge => {
      res.status(201).json({data: challenge})
      })
      .catch(next)
    })

//export routes
module.exports = challengesRouter
