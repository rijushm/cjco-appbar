require('./style.css')
const {gsap} =  require("gsap");
const dayjs = require('dayjs')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
var customParseFormat = require('dayjs/plugin/customParseFormat')
var isBetween = require('dayjs/plugin/isBetween')
var fa = require('font-awesome/css/font-awesome.css');

dayjs.extend(isBetween)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

function getDeviceOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent)) {
        return "Windows";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

const cjcoAppBarStart = async (data)=>{

    var mainUrl;
    var ctaText = data.text;
    
    if(typeof data.icon == 'undefined'){
        data.icon = true
    }

    // get device type
    var device = getDeviceOperatingSystem();

    // create app bar wrapper
    if(document.querySelector('.cjco-app-wrapper')){
        return;
    }
    var appWrapper = document.createElement("div")
    appWrapper.classList.add('cjco-app-wrapper')
    appWrapper.style.background = data.backgroud

    // create app bar link
    var appHref = document.createElement("a")
    appHref.classList.add('cjco-app-url')

    // create app bar inner block
    var appInner = document.createElement("div")
    appInner.classList.add('cjco-app-inner')
    appInner.style.color = data.color

    // create app bar text
    var appText = document.createElement("p")
    appText.classList.add('cjco-app-text', 'flow-up')

    // create app bar icon wrap
    var appIconWrap = document.createElement("i")
    appIconWrap.classList.add('cjco-app-icon-wrap', 'flow-up')

    if(data.target){
        appHref.target = data.target
    }else{
        appHref.target = '_blank'
    }

    if(data.url){
        mainUrl = data.url
    }else{
        if(device == 'Android'){
            if(data.android){
                mainUrl = data.android
            }
        }
        else if(device == 'iOS'){
            if(data.ios){
                mainUrl = data.ios
            }
        }
        else{
            if(data.ios){
                mainUrl = data.ios
            }
        }
    }
    
    appHref.href = mainUrl
    appText.innerHTML = ctaText;

    if(data.automate){
        data.automate.forEach(async automate => {

            let weekDayIndex, currentDate, currentStoreDate, currentStoreTime, startStoreTime, endStoreTime;

            var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const weekDayIndexAPI = dayjs().day();

            currentDate = dayjs().tz(`${automate.country}/${automate.city}`).format();

            currentStoreDate = dayjs().format('YYYY-MM-DD')
            startDate = dayjs.tz(`${currentStoreDate} ${automate.startTime}`, `${automate.country}/${automate.city}`).format();
            endDate = dayjs.tz(`${currentStoreDate} ${automate.endTime}`, `${automate.country}/${automate.city}`).format();

            if(automate.days){
                automate.days.forEach((day)=>{
                
                    if(week.includes(day)){
                        weekDayIndex = week.indexOf(day);
                        
                        if(weekDayIndexAPI == weekDayIndex){

                            if(dayjs(currentDate).isBetween(startDate, endDate)){
                                mainUrl = automate.url
                                ctaText = automate.text
                            }
                            
                        }
                    }else{
                        throw Error('Insert a correct name of weekday. Inserted: '+day)
                    }

                })
            }

            appHref.href = mainUrl
            appText.innerHTML = ctaText;
            
        });
    }

    const body = document.body
    body.appendChild(appWrapper)
    appWrapper.appendChild(appHref)
    appHref.appendChild(appInner)
    appInner.append(appText)

    if(data.icon == true){
        // create app bar icon
        var appIcon = document.createElement("i")
        appIcon.classList.add('cjco-app-icon')

        if(data.url){
            appIcon.classList.add('fa', 'fa-arrow-right')
        }else{
            if(device == 'Windows'){
                appIcon.classList.add('fa-brands', 'fa-windows')
            }
            else if(device == 'Android'){
                appIcon.classList.add('fab', 'fa-google-play')
            }
            else if(device == 'iOS'){
                appIcon.classList.add('fa-brands', 'fa-app-store')
            }
            else{
                appIcon.classList.add('fa-brands', 'fa-app-store')
            }
        }
        appInner.append(appIconWrap)
        appIconWrap.appendChild(appIcon)
    }

    var barHeight = appWrapper.clientHeight;

    var tl = gsap.timeline()

    tl.from('.cjco-app-wrapper', {
        y: barHeight-6,
        duration: 2.6,
        ease: 'elastic.inOut(1, 0.5)'
    })

    tl.from('.flow-up', {
        y: 50,
        duration: 2.6,
        stagger: 0.2,
        ease: 'elastic.inOut(1, 0.5)'
    }, -0.0001)

}

const cjcoAppBar=(data)=>{

    // meta
    if(!document.querySelector("meta[name=viewport]")){
        var meta = document.createElement('meta');
        meta.name = "viewport";
        meta.content = "width=device-width,initial-scale=1.0";
        document.getElementsByTagName('head')[0].appendChild(meta);
    }

    window.addEventListener("DOMContentLoaded", () => {
        if(window.matchMedia("(max-width: 600px)").matches){
            cjcoAppBarStart(data)
        }
    })
    window.addEventListener('resize', function(event) {
        if(window.matchMedia("(max-width: 600px)").matches){
            cjcoAppBarStart(data)
        }
    }, true);
}

module.exports = {
    appBar: function (data) {
        new cjcoAppBar(data);
    }
};