﻿exeApp.directive('ngDatepickerLocal', ['$parse', function ($parse) {
    var directive = {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
        var ngModelController = ctrls[0];

        // called with a JavaScript Date object when picked from the datepicker
        ngModelController.$parsers.push(function (viewValue) {
            // undo the timezone adjustment we did during the formatting
            if (viewValue.getHours() == 0 && viewValue.getTimezoneOffset() < 0)
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            if (viewValue.getHours() == 0 && viewValue.getTimezoneOffset() > 0)
                viewValue.setMinutes(viewValue.getMinutes() + viewValue.getTimezoneOffset());
            // we just want a local date in ISO format
            return viewValue;
        });
    }
}]);