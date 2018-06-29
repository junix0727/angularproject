exeApp.directive('ngRoundOff', function ($filter, $parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        //link: function (scope, element, attrs) {
        //    var ngModel = $parse(attrs.ngModel);
        //    var data = attrs.ngModel.split('.');

        //    element.on('blur', function () {
        //        var number = parseFloat(ngModel(scope));
        //        var result = number.round(attrs.ngRoundOff);

        //        if (data.length == 1) {
        //            scope[data[0]] = result;
        //        } else if (data.length == 2) {
        //            scope[data[0]][data[1]] = result;
        //        }

        //        scope.$apply();
        //    });
        //}
        link: function (scope, element, attrs, ngModelController) {
            //convert data from view format to model format
            ngModelController.$parsers.push(function (data) {
                var number = parseFloat(data);

                //return number.round(attrs.ngRoundOff); //converted
                return number;
            });

            //convert data from model format to view format
            ngModelController.$formatters.push(function (data) {
                return (data) ? $filter('currency')(parseFloat(data), '', attrs.ngRoundOff) : data; //converted
            });
        }
    };
});