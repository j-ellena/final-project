console.log('\x1Bc');

const express = require('express');
const app = express();
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const fs = require('fs');
const nodemailer = require('nodemailer');
const secrets = require('./secrets.json');

// *****************************************************************************
// requiring adequate translation json
// *****************************************************************************

const DEFAULT_LANG = 'hr';
const loadLang = (lang = DEFAULT_LANG) => {
    const loaded = require(`./translations/${lang}.json`);
    if (loaded) {
        updateList(lang);
        return loaded;
    } else {
        updateList(DEFAULT_LANG);
        return require(`./translations/${DEFAULT_LANG}.json`);
    }
};

// *****************************************************************************
// gathering available translations
// *****************************************************************************

let translationsList = {};
const langFiles = fs.readdirSync(`${__dirname}/translations`);
for (let i = 0; i < langFiles.length; i++) {
    const stat = fs.statSync(`${__dirname}/translations/${langFiles[i]}`);
    if (stat.isFile() && langFiles[i].indexOf('.json') !== -1) {
        translationsList[langFiles[i].slice(0, 2)] = {
            langJSON: langFiles[i].slice(0, 2)
        };
    }
}

// *****************************************************************************
// updating the current language
// *****************************************************************************

const updateList = (current) => {

    for (let i in translationsList) {
        if (translationsList[i].langJSON === current) {
            translationsList[i].flag = true;
        } else {
            translationsList[i].flag = false;
        }
    }
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
// csurf middleware
// *****************************************************************************

app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.cookie('mytoken', req.csrfToken());
    next();
});

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
        res.render('home', {
            lang: loadLang(req.session.lang),
            list: translationsList
        });
    } else {
        console.log('§§§§ req.session.lang undefined\n');
        res.render('home', {
            lang: loadLang(),
            list: translationsList
        });
    }
});

app.get('/contact', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app / ...rendering contact view');
    res.status(200);
    res.render('contact', {
        lang: loadLang(req.session.lang),
        list: translationsList
    });
});

app.post("/send", (req, res) => {
    console.log(req.body);
    const output = `
       <p>New message from apartmani-petkovic.hr!</p>
       <ul>
           <li>Name: ${req.body.name}</li>
           <li>Email: ${req.body.email}</li>
           <li>Phone: ${req.body.phone}</li>
       </ul>
       <h3>Message</h3>
       <p>${req.body.message}</p>
       `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: secrets.user,
            pass: secrets.pass
        }
    });

    let mailOptions = {
        from: '"apartmani-petkovic.hr" <jellena.phy@gmail.com>',
        to: "jellena.phy@gmail.com",
        subject: "Hello :heavy_check_mark:",
        text: "Hello world?",
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.render('contact', {
            lang: loadLang(req.session.lang),
            list: translationsList,
            success: true
        });
    });
});

// app.get('/admin', (req, res) => {
//     console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app / ...rendering admin view');
//     res.status(200);
//     res.render('admin');
// });

// *****************************************************************************
// XMLHttpRequests from the client
// *****************************************************************************

app.post('/axios/browserLang', (req, res) => {
    console.log('§§§§§§§ post axios browserLang - req.body:\n', req.body);
    if (!req.session.lang && req.body.lang !== DEFAULT_LANG && translationsList.hasOwnProperty(req.body.lang) ) {
        req.session.lang = req.body.lang;
        console.log('§§§§ !req.session.lang && browserLang != default && supported - reloading');
        updateList(req.session.lang);
        console.log('§§§§ updated list\n');
        res.json ({ reload : true });
    } else {
        console.log('§§§§ req.session.lang || browserLang == default || not supported\n');
        res.end();
    }
});

app.post('/axios/userLang', (req, res) => {
    console.log('§§§§§§§ post axios userLang - req.body:\n', req.body);
    req.session.lang = req.body.lang;
    updateList(req.session.lang);
    console.log('§§§§ updated list\n');
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
