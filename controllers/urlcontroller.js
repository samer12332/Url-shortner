const {getDb} = require('../bin/db');

function makeRandomString(legnth) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const len = characters.length;
    for(let i = 0; i < legnth; i++) {
        result += characters.charAt(Math.floor(Math.random() * len));
    }
    return result;
}

let alias;

function getHome (req, res, next) {
    let db = getDb();
    let links = [];
    db.collection('urls')
    .find()
    .forEach(link => links.push(link)) 
    .then((result) => {
        res.render('index', { title: 'Express', links});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: "Not Found"});
    });
}

const getAlias = (req, res) => {

    alias = `http://localhost:3000/${req.params.alias}`;
    
    let db = getDb();
    db.collection('urls')
    .findOne({alias})
    .then((result) => {
        res.status(200).redirect(result.URL);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: "Not Found"});
    });
}

const postAlias = (req, res) => {
    let db = getDb();
    let baseUrl = req.body.alias.slice(0, 22);
    if(req.body.alias == 'http://localhost:3000/') {
        req.body.alias = 'http://localhost:3000/' + makeRandomString(6);
        db.collection('urls')
    .insertOne(req.body)
    .then((result) => {
            res.status(200).redirect('/');
    })
    .catch((err) => {
        console.log(err);
    })
    } else if(baseUrl == 'http://localhost:3000/') {
        db.collection('urls')
    .insertOne(req.body)
    .then((result) => {
            res.status(200).redirect('/');
    })
    .catch((err) => {
        console.log(err);
    })
    } else {
        res.render('error', {message: 'Wrong format', error: {status: 404, stack: ''}});
    }
}

module.exports = {
    getHome,
    getAlias,
    postAlias
}

