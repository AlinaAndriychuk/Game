function sayHello() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = ['\n %c Made with ❤️ by Alina Andriychuk \n', 'border: 1px solid #fff;color: #fff; padding:5px 0;'];
        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('Made with love ❤️ by Alina Andriychuk ❤️');
    }
}
module.exports = sayHello;
