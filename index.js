const request = require("axios")
const argv = require("yargs").argv

async function getMeta(stateId) {
    var url = `/2020-statewide-metadata/${stateId}/potus.meta.json`
    var options = {
        method: 'GET',
        baseURL: 'https://www.politico.com',
        url: url
    }
    var data = await request.request(options)
    return data.data.candidates
}

async function getData(stateId, candidateData) {
    var url = `/2020-statewide-results/${stateId}/potus.json`
    var options = {
        method: 'GET',
        baseURL: 'https://www.politico.com',
        url: url
    }
    var data = await request.request(options)
    // console.log(data.data[0].candidates)
    var candidates = data.data[0].candidates
    var trump = {
        vote: 0
    }
    var biden = {
        vote: 0
    }
    for (candidate of candidateData) {
        for (runner of candidates) {
            if (candidate.candidateID == runner.candidateID) {
                if (runner.vote > 100000) {
                    console.log(`${candidate.fullName} has ${runner.vote}`)
                    if (candidate.fullName.match(/trump/i)) {
                        
                        trump.vote = runner.vote
                    }
                    if (candidate.fullName.match(/biden/i)) {
                        biden.vote = runner.vote
                    }
                }
            }
        }
    }
    console.log(`Difference: ${trump.vote - biden.vote}`)
}

async function main() {
    
    var statdId = 0
    if (argv.state.match(/ga/i)) {
        stateId = 13
    }
    if (argv.state.match(/pa/i)) {
        stateId = 42
    }
    if (argv.state.match(/nv/i)) {
        stateId = 32
    }
    var candidateData = await getMeta(stateId)
    await getData(stateId, candidateData)
}
main()
