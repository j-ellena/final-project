console.log('\x1Bc');

const express = require('express');
const app = express();
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const fs = require('fs');

// *****************************************************************************
// requiring adequate translation json
// *****************************************************************************

let translationsList = [];
const langFiles = fs.readdirSync(`${__dirname}/translations`);
for (let i = 0; i < langFiles.length; i++) {
    const stat = fs.statSync(`${__dirname}/translations/${langFiles[i]}`);
    if (stat.isFile() && langFiles[i].indexOf('.json') !== -1) translationsList.push(langFiles[i]);
}
console.log('§§§§§§§ translationsList:\n', translationsList);

const DEFAULT_LANG = 'en';
const loadLang = (lang = DEFAULT_LANG) => {
    const loaded = require(`./translations/${lang}.json`);
    if (loaded) return loaded;
    else return require(`./translations/${DEFAULT_LANG}.json`);
};

// *****************************************************************************
// serving static files
// *****************************************************************************

app.use(express.static(`${__dirname}/public`));

// *****************************************************************************
// body parser json
// *****************************************************************************

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// *****************************************************************************
// cookie session
// *****************************************************************************

app.use(cookieSession({
    secret: '...my secret cookie session',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

// *****************************************************************************
// handlebars boilerplate
// *****************************************************************************

app.engine('handlebars', hb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// *****************************************************************************
// HttpRequests from the client
// *****************************************************************************

app.get('/', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app / ...rendering home view');
    res.status(200);
    if (req.session.lang) {
        console.log('§§§§ req.session.lang defined:\n', req.session.lang, '\n');
        res.render('home', {lang: loadLang(req.session.lang)});
    } else {
        console.log('§§§§ req.session.lang undefined\n');
        res.render('home', {lang: loadLang()});
    }
});

// *****************************************************************************
// XMLHttpRequests from the client
// *****************************************************************************

app.post('/axios/browserLang', (req, res) => {
    console.log('§§§§§§§ post axios browserLang - req.body:\n', req.body);
    if (!req.session.lang && req.body.lang !== DEFAULT_LANG && translationsList.indexOf(req.body.lang) !== -1 ) {
        req.session.lang === req.body.lang;
        console.log('§§§§ !req.session.lang && browserLang != default && supported - reloading\n');
        res.json ({ reload : true });
    } else {
        console.log('§§§§ req.session.lang || browserLang == default || not supported\n');
        res.end();
    }
});

app.post('/axios/userLang', (req, res) => {
    console.log('§§§§§§§ post axios userLang - req.body:\n', req.body, '\n');
    req.session.lang = req.body.lang;
    res.end();

});


// *****************************************************************************
// listening
// *****************************************************************************

app.listen(process.env.PORT || 8080,
    console.log(`
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    §§§§§§§§§§§§§§ server listening §§§§§§§§§§§§§§
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    `));
