(function(){

    let instance = axios.create({
        xsrfCookieName: 'mytoken',
        xsrfHeaderName: 'csrf-token'
    });

    console.log(`
        §§§§§§§§§§§§§§§§§§§§§§
        §§§§§§§ ticker §§§§§§§
        §§§§§§§§§§§§§§§§§§§§§§
        `);


    const speed = 1;
    makeCall();

    function makeCall() {

        console.log('§§§§§§§ ticker - makeCall');
        
        instance.get('/axios/weather')
            .then((response) => {
                let data = response.data.weather;

                const headlinesLeft = $('#footer').find('.headlines');

                for (let i = 0; i < data.length; i++) {
                    let links = `<span>${data[i]}</span>\n\n\n`;

                    headlinesLeft.append(links);
                }

                tick(false, '#footer');

            });
    }

    function tick(d, id) {
        const ticker = $(id);
        let headlines = ticker.find('.headlines');
        let links = headlines.find('span');
        let offset, border;

        if (!d) {
            offset = headlines.offset().left;
        } else {
            offset = -headlines.outerWidth();
            headlines.css({ left: offset + 'px' });
        }

        animateHeadlines();

        function animateHeadlines() {
            if (!d) {
                links = headlines.find('span');
                border = links.eq(0);
                offset -= speed;

                if (offset < -border.outerWidth()) {
                    headlines = ticker.find('.headlines');
                    links = headlines.find('span');
                    border = links.eq(0);
                    offset += border.outerWidth();
                    headlines.append(border);
                }
            } else {
                headlines = ticker.find('.headlines');
                links = headlines.find('span');
                border = links.eq(links.length - 1);
                offset += speed;

                if (
                    offset >
				window.innerWidth + border.outerWidth() - headlines.outerWidth()
                ) {
                    headlines.prepend(border);
                    offset -= border.outerWidth();
                }
            }
            headlines.css({ left: offset + 'px' });
            requestAnimationFrame(function() {
                animateHeadlines(d, id);
            });
        }
    }

})();
