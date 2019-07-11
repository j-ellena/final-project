let instance = axios.create({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

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

instance.post('/axios/browserLang', { lang : browserLang[1].slice(0, 2).toLowerCase() })
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

    $('body').on('click', (e) => {
        console.log('§§§§§§§ click on body\n\n');
        if (e.target.id !== 'lang-partial' && $('#lang-partial').is(':visible')) {
            console.log('§§§§ click outside of lang-partial\n\n');
            $('#lang-partial').hide();
            console.log('§§§§§ hiding lang-partial\n\n');
        }
    });
});

$('#lang-partial').on('click', (e) => {
    e.stopPropagation();
    console.log('§§§§§§§ click on lang-partial - icon:\n', e.target.alt, '\n\n');

    // *************************************************************************
    // user selected language to the server
    // *************************************************************************

    instance.post('/axios/userLang', { lang : e.target.alt })
        .then( () => {
            window.location.reload();
            console.log('§§§§ axios post userLang - req.body:\n', { lang : e.target.alt }, '\n\n');
        });
});

// *****************************************************************************
// navbar listeners
// *****************************************************************************

$('#contact-nav-hover').hide();

$('#contact-nav').on('mouseenter', () => {
    $('#contact-nav-icon').hide();
    $('#contact-nav-hover').show();
});

$('#contact-nav').on('mouseleave', () => {
    $('#contact-nav-hover').hide();
    $('#contact-nav-icon').show();
});

// *****************************************************************************
// daterangepicker
// *****************************************************************************

$('#dateContact').daterangepicker({
    'autoApply': true,
}, (start, end, label) => {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
});

// *****************************************************************************
// apps
// *****************************************************************************

$('#app-red').hide();
$('#app-orange').hide();
$('#app-pink').hide();
$('#app-blue').hide();
$('#app-white').hide();
$('#app-green').hide();
$('.calendar-grid').hide();
$('#model').show();
$('#info').show();
$('td').css('height', '5vh');
$('.calendar-grid').on('click', (e) => {
    e.stopPropagation();
});

$('#apps-grid').on('click', () => {
    if ($('#app-red').is(':visible')) {
        $('#app-red').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
    if ($('#app-orange').is(':visible')) {
        $('#app-orange').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
    if ($('#app-pink').is(':visible')) {
        $('#app-pink').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
    if ($('#app-blue').is(':visible')) {
        $('#app-blue').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
    if ($('#app-white').is(':visible')) {
        $('#app-white').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
    if ($('#app-green').is(':visible')) {
        $('#app-green').hide();
        $('.calendar-grid').hide();
        $('#model').show();
        $('#info').show();
    }
});

$('#app-red-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-red').toggle();
    $('td').css('height', '5vh').css('font-size', '1vw');
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-orange').hide();
    $('#app-pink').hide();
    $('#app-blue').hide();
    $('#app-white').hide();
    $('#app-green').hide();
    $('#app-red').on('click', (e) => {
        e.stopPropagation();
    });
});

$('#app-orange-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-orange').toggle();
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-red').hide();
    $('#app-pink').hide();
    $('#app-blue').hide();
    $('#app-white').hide();
    $('#app-green').hide();
    $('#app-orange').on('click', (e) => {
        e.stopPropagation();
    });
});

$('#app-pink-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-pink').toggle();
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-red').hide();
    $('#app-orange').hide();
    $('#app-blue').hide();
    $('#app-white').hide();
    $('#app-green').hide();
    $('#app-pink').on('click', (e) => {
        e.stopPropagation();
    });
});

$('#app-blue-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-blue').toggle();
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-red').hide();
    $('#app-orange').hide();
    $('#app-pink').hide();
    $('#app-white').hide();
    $('#app-green').hide();
    $('#app-blue').on('click', (e) => {
        e.stopPropagation();
    });
});

$('#app-white-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-white').toggle();
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-red').hide();
    $('#app-orange').hide();
    $('#app-pink').hide();
    $('#app-blue').hide();
    $('#app-green').hide();
    $('#app-white').on('click', (e) => {
        e.stopPropagation();
    });
});

$('#app-green-thumbnail').on('click', (e) => {
    e.stopPropagation();
    $('#app-green').toggle();
    $('.calendar-grid').show();
    $('#model').hide();
    $('#info').hide();
    $('#app-red').hide();
    $('#app-orange').hide();
    $('#app-pink').hide();
    $('#app-blue').hide();
    $('#app-white').hide();
    $('#app-green').on('click', (e) => {
        e.stopPropagation();
    });
});

// *****************************************************************************
// calendar
// *****************************************************************************

$('#date-start').hide();
// $('#date-end').hide();
$('#label-start').on('click', () => {
    $('#date-start').toggle();
});
// $('#label-end').on('click', () => {
// $('#date-end').toggle();
// });

$('#calendar').on('click', (e) => {
    // .not('.unavailable')
    // .on('click', (e) => {
    // console.log('click', e);
    // if (e.target.classList.length !== 0) {
    //     if (e.target.classList.indexOf('unavailable') !== -1) {
    //         console.log('>>>>>>> click', e.target.textContent);
    //     }
    // } else {
    // }
    let tableCell = $('#calendar').find('.availability-calendar').find('tr').find('td');
    console.log('>>>>>>> month year: ', $('#calendar').find('.availability-calendar-toolbar').find('span')[0].textContent);
    console.log('>>>>>>> day: ', e.target.textContent);
    // console.log('>>>>>>> tr: ', tableCell, typeof(tableCell));
    // console.log('>>>>>>> tr', Object.values(x));
    // console.log('>>>>>>> tr', (x.values())[0].indexOf('unavailable'));
    let availableDates = [];
    if(e.target.classList.value.indexOf('unavailable') < 0) {
        console.log('--------------');
        e.target.classList.value ='reserved';
    }
    for (let i = 0; i < 41; i++) {
        if (Object.values(tableCell)[i].classList.value.indexOf('unavailable') === -1) {
            console.log(Object.values(tableCell)[i]);
            availableDates.push(Object.values(tableCell)[i]);
        }
    }
    // console.log('<<<<<<< availableDates:', availableDates);

    // for (let i = 0; i < availableDates.length; i++) {
    //     availableDates[i][0].on('click', () => {
    //         availableDates[i][0].addClass('reserved');
    //     });
    // }
    // console.log('§§§§§§§§§§§ svi datumi', Object.values(tableCell)[i].classList.value);
    // }

});

// *****************************************************************************
//
// *****************************************************************************
