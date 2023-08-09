function sliderJS(id, options) {
    let slider = document.querySelector('#'+ id);

    let sliderImages = slider.getElementsByTagName('img');

    let sliderWrapper = document.createElement('div');

    sliderWrapper.className = "slider_wrapper";

    slider.prepend(sliderWrapper);

    let sliderItems = document.createElement('div');

    sliderItems.className = "slider_items";

    sliderWrapper.prepend(sliderItems);

    if (options.actions === true) {

        let sliderOptions = document.createElement('div');

        sliderOptions.className = "slider_options_wrapper";

        sliderOptions.innerHTML = `
            <div class="slider_options">
                <button class="button_to_left slider_button">left</button>
                <button class="button_to_right slider_button">right</button>
                <button class="button_hide_action slider_button">hide</button>
            </div>
        `

        sliderWrapper.append(sliderOptions);
    }


    if(sliderImages.length < 3) {
        for (let i = 0; (3 - sliderImages.length) > i; i++) {
            slider.appendChild(sliderImages[sliderImages.length - 1].cloneNode())
        }
    }

    sliderImages = slider.getElementsByTagName('img');

    if(sliderImages.length % options.maxSlides !== 0) {
        for(let i = 0; (sliderImages.length % options.maxSlides) > i; i++) {
            slider.appendChild(sliderImages[sliderImages.length - 1].cloneNode())    
        }
    }

    sliderImages = slider.getElementsByTagName('img');

    sliderItems.style.width = slider.offsetWidth * sliderImages.length / options.maxSlides + 'px';

    for (let i = 0; i < sliderImages.length; i++) {
        sliderItems.insertAdjacentElement('beforeend', sliderImages[i]);
        sliderImages[i].setAttribute("draggable", "false")
        sliderImages[i].style.width = slider.offsetWidth / options.maxSlides + 'px';

        sliderImages[i].style.height = '100%';

    }


    let btnR = document.querySelector('.button_to_right');

    let btnL = document.querySelector('.button_to_left');

    let btnHide = document.querySelector('.button_hide_action');

    if (options.actions === true) {

        btnR.addEventListener('click', () => {
            moveRight();
            blockActivity();
            unblockActivity();
        })

        btnL.addEventListener('click', () => {
            moveLeft();
            blockActivity();
            unblockActivity();
        })

        btnHide.addEventListener('click', () => {

            if(btnHide.classList.contains('hidden')) {
                btnHide.classList.remove('hidden');
                btnL.style.display = 'block';
                btnR.style.display = 'block';
                btnHide.style.width = '80px';
                btnHide.style.height = '80px';
                document.querySelector('.slider_options').style.justifyContent = 'space-between'
            } else {
                btnHide.classList.add('hidden');
                btnHide.style.width = '35px'
                btnHide.style.height = '35px'
                btnL.style.display = 'none';
                btnR.style.display = 'none';
                document.querySelector('.slider_options').style.justifyContent = 'center'
            }
        
        })
    }


    let x1 = 0;

    sliderItems.addEventListener('mousedown', (e) => {
        x1 = e.clientX
    })
    
    sliderItems.addEventListener('mouseup', (e) => {
        let x2 = e.clientX
        
        if(Math.abs(x2) > Math.abs(x1)) {
            moveLeft();
        }
        if(Math.abs(x2) < Math.abs(x1)) {
            moveRight();
        }
        blockActivity();
        unblockActivity();

    })

    sliderItems.addEventListener('touchstart', (e) => {
        x1 = e.touches[0].clientX;
    })
    
    sliderItems.addEventListener('touchend', (e) => {
        let x2 = e.changedTouches[0].clientX;
        if(Math.abs(x2) > Math.abs(x1)) {
            moveLeft();
        }
        if(Math.abs(x2) < Math.abs(x1)) {
            moveRight();
        }
        blockActivity();
        unblockActivity();
    })



    let activeSlide = options.maxSlides;

    let translatevalue = parseFloat(getComputedStyle(sliderItems).translate);

    function moveLeft() {
    activeSlide -= options.maxSlides;
    translatevalue = parseFloat(getComputedStyle(sliderItems).translate);
    if(translatevalue < 0) {
         sliderItems.style.translate = translatevalue + slider.offsetWidth + 'px';
         sliderItems.style.transitionDuration = '400ms';
    } else if(activeSlide < 1 && options.loop === true) {
        sliderItems.style.transitionDuration = '0ms';
        sliderItems.style.translate = -slider.offsetWidth + 'px';
        for(let i = 0; options.maxSlides > i; i++) {
            sliderItems.insertAdjacentElement('afterbegin', sliderItems.lastChild);
        }
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                sliderItems.style.transitionDuration = '400ms';
                sliderItems.style.translate = translatevalue + 'px';
            })
        }) 
        activeSlide += options.maxSlides;
    }
    }

    function moveRight() {
        translatevalue = parseFloat(getComputedStyle(sliderItems).translate);
        activeSlide += options.maxSlides;
        if( -translatevalue < slider.offsetWidth * sliderImages.length / options.maxSlides - slider.offsetWidth) {
            sliderItems.style.translate = translatevalue - slider.offsetWidth + 'px';
            sliderItems.style.transitionDuration = '400ms';
        } else if(activeSlide > sliderImages.length && options.loop === true) {
            sliderItems.style.transitionDuration = '0ms';
            sliderItems.style.translate = translatevalue  + slider.offsetWidth + 'px';
            for(let i = 0; options.maxSlides > i; i++) {
                sliderItems.insertAdjacentElement('beforeend', sliderItems.firstChild);
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sliderItems.style.transitionDuration = '400ms';
                    sliderItems.style.translate = translatevalue + 'px';
                })
            })            
            activeSlide -= options.maxSlides;
        }    
    }


    function blockActivity() {
        if(options.actions === true) {
            btnL.setAttribute("disabled", "true");
            btnR.setAttribute("disabled", "true");
        }
        slider.style.pointerEvents = 'none';
    }

    function unblockActivity() {
        setTimeout(() => {
            if(options.actions === true) {
                btnL.removeAttribute("disabled"); 
                btnR.removeAttribute("disabled"); 
            }
            slider.style.pointerEvents = 'auto'; 
            sliderItems.style.transitionDuration = '0ms';
        }, 500);
    }

    const styles = document.createElement('style');

    styles.innerHTML = `
        .slider_wrapper {
            width: 100%;
            overflow: clip;
            position: relative;
            height: 100%;
        }

        .slider_items {
            display: flex; 
            overflow-x: clip;
            translate: 0;
            transition: all ease;
        }

        .slider_item {
            width: 1920px;
            height: auto;
        }

        .slider_options_wrapper {
            display: flex;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 120px;
            justify-content: center;
        }

        .slider_options {
            display: flex;
            width: 80%;
            max-width: 1240px;
            height: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .slider_button {
            width: 80px;
            height: 80px;
            border: 1px solid black;
            border-radius: 50%;
        }

        .slider_button:hover {
            cursor: pointer;
        }
    
    `
    document.querySelector('head').append(styles);
}
