console.log('\x1Bc');

const express = require('express');
const app = express();
const hb = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const fs = require('fs');
const nodemailer = require('nodemailer');
const request = require('request');
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
// checking for adminLog
// *****************************************************************************

// const checkForAdmin = (req, res, next) => {
//     console.log('§§§§§§§ checking for admin\n');
//     !req.session.admin
//         ? res.redirect('/')
//         : next();
// };

// *****************************************************************************
// HttpRequests from the client
// *****************************************************************************

app.get('/', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app / ...rendering home view');
    res.status(200);
    res.render('home', {
        lang: loadLang(req.session.lang),
        list: translationsList,
        success: false
    });
});

app.get('/ticker', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app / ...rendering home view');
    res.status(200);
    res.render('ticker');
});

app.get('/contact', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app contact ...rendering contact view');
    res.status(200);
    res.render('contact', {
        lang: loadLang(req.session.lang),
        list: translationsList
    });
});

app.post('/contactSend', (req, res) => {
    console.log('§§§§ post app contactSend req.body:\n', req.body);
    const output = `
       <p>New message from apartmani-petkovic.hr!</p>
       <ul>
           <li>Name: ${req.body.name}</li>
           <li>Email: ${req.body.email}</li>
           <li>Phone: ${req.body.phone}</li>
           <li>Dates: ${req.body.daterange}</li>
       </ul>
       <h3>Message</h3>
       <p>${req.body.message}</p>
       `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: secrets.cont_mail,
            pass: secrets.cont_pass
        }
    });

    let mailOptions = {
        from: '"apartmani-petkovic.hr" <jellena.phy@gmail.com>',
        to: "jellena.phy@gmail.com",
        subject: "Contact Apartmani Petkovic",
        text: "Hello world?",
        html: output
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("§§§§ Message sent: %s", info.messageId);
        console.log("§§§§ Preview URL: %s", nodemailer.getTestMessageUrl(info), '\n');

        res.render('home', {
            lang: loadLang(req.session.lang),
            list: translationsList,
            success: true
        });
    });
});

app.get('/admin', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app admin ...rendering admin view');
    res.status(200);
    res.render('admin', {
        lang: loadLang(req.session.lang),
        list: translationsList,
        success: false
    });
});

app.post('/adminLog', (req, res) => {
    console.log('§§§§ post app adminLog req.body:\n', req.body);
    if (req.body.email === secrets.admin_mail && req.body.password === secrets.admin_pass) {
        req.session.admin = true;
        res.render('admin', {
            lang: loadLang(req.session.lang),
            list: translationsList,
            success: true,
            message: 'Logged successfully!'
        });
    } else {
        res.render('admin', {
            lang: loadLang(req.session.lang),
            list: translationsList,
            success: false,
            message: 'Username and password do not match! Try again:'
        });
    }
});

app.get('/apps', (req, res) => {
    console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§\n§§§§§§§ get app apps ...rendering apps view');
    res.status(200);
    res.render('apps', {
        lang: loadLang(req.session.lang),
        list: translationsList
    });
});

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

app.get('/axios/weather', (req, res) => {
    getWeather().then((data) => {
        console.log('§§§§§§§ get axios weather - data:\n', data);
        res.json({weather: data});
    });
});

// *****************************************************************************
// openWeatherAPI
// *****************************************************************************

const getWeather = () => {
    return new Promise((resolve, reject) => {

        const apiKey = secrets.owm_key;
        const city = secrets.owm_city;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        request(url, function (err, response, body) {
            if(err) {
                reject (err);
            } else {
                let data = JSON.parse(body);
                const weather = [
                    `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="weather"/> Šibenik`,
                    `<img class="filter" src="../assets/owm/thermometer.png" alt="thermometer"/> ${data.main.temp} &#176;C`,
                    `<img class="filter" src="../assets/owm/hygrometer.png" alt="hygrometer"/> ${data.main.humidity} %`,
                    `<img class="filter" src="../assets/owm/barometer.png" alt="barometer"/> ${data.main.pressure} hPa`
                ];
                resolve (weather);
            }
        });
    });
};



// *****************************************************************************
// listening
// *****************************************************************************

app.listen(process.env.PORT || 8080,
    console.log(`
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    §§§§§§§§§§§§§§ server listening §§§§§§§§§§§§§§
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    `));
