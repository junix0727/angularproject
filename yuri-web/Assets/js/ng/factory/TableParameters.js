exeApp.factory('TableParameters', function ($sce) {
    var TableParameters = function (parameters) {
        var filters = {};

        if (parameters.filters) {
            filters = angular.fromJson(parameters.filters);

            angular.forEach(filters, function (value, key) {
                filters[key] = decodeURIComponent(value);
            });
        }

        this.count = parameters.count ? parameters.count : 25;
        this.filters = filters;
        this.page = parameters.page ? parameters.page : 1;
        this.sorting = parameters.sorting ? angular.fromJson(parameters.sorting) : {};
    }

    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    TableParameters.prototype = {
        setParameters: function (table) {
            this.count = table.count();
            this.page = table.page();
            this.sorting = table.sorting();

            var filters = angular.copy(table.filter());

            angular.forEach(filters, function (value, key) {
                filters[key] = encodeURIComponent(value);
            });

            this.filters = filters;

            return this;
        },
        toUrl: function (hasPrevious) {
            var previous = hasPrevious ? '&' : '?';
            var filters = this.filters;

            angular.forEach(filters, function (value, key) {
                filters[key] = encodeURIComponent(value);
            });

            return previous +
                'page=' + this.page +
                '&count=' + this.count +
                '&sorting=' + angular.toJson(this.sorting) +
                '&filters=' + angular.toJson(filters);
        },
        isEmpty: function (object) {
            // null and undefined are "empty"
            if (this[object] == null) {
                return true;
            }

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (this[object].length > 0) {
                return false;
            }

            if (this[object].length === 0) {
                return true;
            }

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in this[object]) {
                if (hasOwnProperty.call(this[object], key)) {
                    return false;
                }
            }

            return true;
        }
    };

    return TableParameters;
});
