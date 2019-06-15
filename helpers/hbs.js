const moment = require('moment');
const express = require('express');
const exphbs = require('express-handlebars');

module.exports = {
    radioCheck: function(value, radioValue){
        if (value === radioValue) {
            return 'checked';
        } else {
            return '';
        }
    },
    formatDate: function(date, targetFormat){
        return moment(date).format(targetFormat);
    },
    checkUserType: function(userType){
        if (userType.slice(0,6).toLowerCase() == "member") {
            return 'Member';
        } else if (userType.slice(0,3).toLowerCase() == 'org') {
            return 'Organization';
        } else if (userType.slice(0,5).toLowerCase() == 'admin') {
            return 'Administrator';
        } else {
            return 'An Uncle';
        }
    },
    ifEqual: (arg1, arg2, options) => {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
};