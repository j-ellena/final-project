console.log(`
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    §§§§§§§ client listening §§§§§§§
    §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
    `);

// *****************************************************************************
// default browser language to the server
// *****************************************************************************

const browserLang = window.navigator.languages;
console.log('§§§§§§§ detecting browserLang:\n', browserLang[1].slice(0, 2).toLowerCase());

axios.post('/axios/browserLang', { lang : browserLang[1].slice(0, 2).toLowerCase() })
    .then((response) => {
        if (response.data.reload) window.location.reload();
        console.log('§§§§§§§ axios post browserLang - req.body:\n', { lang : browserLang[1].slice(0, 2).toLowerCase() }, '\n\n');
    });

// *****************************************************************************
// language menu listeners
// *****************************************************************************

$('#lang-partial').hide();

$('#lang-nav').on('click', (e) => {
    e.stopPropagation();
    console.log('§§§§§§§ click on lang-nav\n\n');
    $('#lang-partial').toggle();
    console.log('§§§§§§§ toggling lang-partial\n\n');
});

$('#lang-partial').on('click', (e) => {
    e.stopPropagation();
    console.log('§§§§§§§ click on lang-partial - icon:\n', e.target.alt, '\n\n');

    // *************************************************************************
    // user selected language to the server
    // *************************************************************************

    axios.post('/axios/userLang', { lang : e.target.alt })
        .then( () => {
            window.location.reload();
            console.log('§§§§ axios post userLang - req.body:\n', { lang : e.target.alt }, '\n\n');
        });
});

// *****************************************************************************
// body listeners
// *****************************************************************************

$('body').on('click', (e) => {
    console.log('§§§§§§§ click on body\n\n');
    if (e.target.id !== 'lang-partial' && $('#lang-partial').is(':visible')) {
        console.log('§§§§ click outside of lang-partial\n\n');
        $('#lang-partial').hide();
        console.log('§§§§§ hiding lang-partial\n\n');
    }
});

// *****************************************************************************
//
// *****************************************************************************
