exeApp.filter("numberPadding", function() {
    return function(number, padding) {
        padding = (padding || 0);
        if (number !== null && number !== undefined) {
            var str = "" + number;
            while (str.length < padding) str = "0" + str;
            return str;
        }
    };
})