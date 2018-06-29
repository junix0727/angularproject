exeApp.filter('codeDescriptionFilter', function () {
    return function (items, input) {
        var filtered = [];
    
        if (input === undefined || input === '') {
            return items;
        }

        if (!items) {
            return filtered;
        }

        items.forEach(function (item) {
            if (!isNaN(input[0])) {
                if (item.Code.indexOf(input) == 0) {
                    filtered.push(item);
                }
            } else if (item.Description) {
                if (item.Description.toString().toLowerCase().indexOf(input) != -1 || item.Description.toString().toUpperCase().indexOf(input) != -1) {
                    filtered.push(item);
                }
            } 
        });
  
        return filtered;
    };
})