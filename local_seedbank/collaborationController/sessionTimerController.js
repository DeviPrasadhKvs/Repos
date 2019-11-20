module.exports = (app, sessionTimerModel)=>{

    app.post('/startTimer', (req, res)=>{
        collaborationID = req.body.collaborationID
        startTime = req.body.startTime
    })
}