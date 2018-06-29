exeApp.directive('dateValidator', function ($browser) {
    var getPattern = function (language) {
        var pattern = '';

        switch (language) {
            case '2':
            case 'nl-NL':
                //dd-MM-yy
                pattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-([0-9]{2})$/;
                break;
            case '3':
            case 'fr-FR':
                //dd/MM/yy
                pattern = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/;
                break;
            case '4':
            case 'de-DE':
            case '5':
            case 'lv-LV':
            case '6':
            case 'ru-RU':
                //dd.MM.yy
                pattern = /^(0[1-9]|1\d|2\d|3[01]).(0[1-9]|1[0-2]).([0-9]{2})$/;
                break;
            default:
                //dd-MM-yy
                pattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-([0-9]{2})$/;
                break;
        }

        return pattern;
    };

    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            function validate(value) {
                var language = preloadedData.User.Locale || preloadedData.User.LanguageId;
                var pattern = new RegExp(getPattern(language));

                if (value !== undefined && value != null && value != '') {
                    ngModel.$setValidity('badDate', true);

                    if (value instanceof Date) {
                        var d = Date.parse(value);

                        // it is a date
                        if (isNaN(d)) {
                            ngModel.$setValidity('badDate', false);
                        }
                    } else {
                        if (value != '' && !pattern.test(value)) {
                            ngModel.$setValidity('badDate', false);
                        }
                    }
                } else {
                    ngModel.$setValidity('badDate', false);
                }
            }

            scope.$watch(function () {
                return ngModel.$viewValue;
            }, validate);
        }
    };
});
