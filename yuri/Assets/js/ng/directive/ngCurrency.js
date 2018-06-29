/*
 * ng-currency
 * http://alaguirre.com/

 * Version: 0.10.1 - 2016-06-05
 * License: MIT
 */

exeApp.directive('ngCurrency', ['$filter', '$locale', '$parse', function ($filter, $locale, $parse) {
    return {
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ngModel) {

            if (attrs.ngCurrency === 'false') return;
            attrs.$observe('min', function (v) { scope.min = v; });
            attrs.$observe('max', function (v) { scope.max = v; });
            attrs.$observe('currencySymbol', function (v) { scope.currencySymbol = v; });
            attrs.$observe('ngRequired', function (v) { scope.ngRequired = v; });
            attrs.$observe('fraction', function (v) { scope.fraction = v; });
            attrs.$observe('calculate', function (v) { scope.calculate = v; });
            scope.fraction = (typeof scope.fraction !== 'undefined') ? scope.fraction : 2;
            scope.calculate = (typeof scope.calculate !== 'undefined') ? scope.calculate : true;
            function decimalRex(dChar) {
                return RegExp("\\d|\\-|\\" + dChar, 'g');
            }

            function clearRex(dChar) {
                return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0," + scope.fraction + "}", 'g');
            }

            function clearValue(value) {
                value = String(value);
                var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                var cleared = null;

                if (value.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) == -1 &&
                   value.indexOf('.') != -1 &&
                   scope.fraction) {
                    dSeparator = '.';
                }

                // Replace negative pattern to minus sign (-)
                var neg_dummy = $filter('currency')("-1", getCurrencySymbol(), scope.fraction);
                var neg_regexp = RegExp("[0-9." + $locale.NUMBER_FORMATS.DECIMAL_SEP + $locale.NUMBER_FORMATS.GROUP_SEP + "]+");
                var neg_dummy_txt = neg_dummy.replace(neg_regexp.exec(neg_dummy), "");
                var value_dummy_txt = value.replace(neg_regexp.exec(value), "");

                // If is negative
                if (neg_dummy_txt == value_dummy_txt) {
                    value = '-' + neg_regexp.exec(value);
                }

                if (RegExp("^-[\\s]*$", 'g').test(value)) {
                    value = "-0";
                }

                if (decimalRex(dSeparator).test(value)) {
                    cleared = value.match(decimalRex(dSeparator))
                        .join("").match(clearRex(dSeparator));
                    cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                }

                return cleared;
            }

            function getCurrencySymbol() {
                if (!angular.isDefined(scope.currencySymbol))
                    scope.currencySymbol = "";

                if (angular.isDefined(scope.currencySymbol)) {
                    return scope.currencySymbol;
                } else {
                    return "";
                }
            }

            function reformatViewValue() {
                var formatters = ngModel.$formatters,
                    idx = formatters.length;

                var viewValue = ngModel.$$rawModelValue;
                while (idx--) {
                    viewValue = formatters[idx](viewValue);
                }

                var cVal = clearValue(viewValue);
                if (cVal == "." || cVal == "-.") {
                    cVal = ".0";
                }
                ngModel.$setViewValue(parseFloat(cVal));
                ngModel.$render();
            }


            function calculte() {
                var value = ngModel.$$rawModelValue.toString();
                value = value.replace(/[\,]/g, '.');
                value = value.replace(/[^0-9\.\/\\*\\\+\\\\-]/g, '');
                var str = value.match(/[^\d()]+|[\d.]+/g);
                var expressions = ['/', '*', '+', '-'];
                var charIndex = null;
                var result = 0;
                var string = [];

                for (var index = 0; index < str.length; index++) {
                    if (str[index] == '.' || (str[index] == '-' && index == 0)) {
                        string.push(str[index] + str[index + 1]);

                        index++;
                    } else {
                        string.push(str[index]);
                    }
                }
                str = angular.copy(string);
                for (var index = 1; index < str.length; index += 2) {

                    charIndex = expressions.indexOf(str[index]);

                    if (charIndex != -1 && index != 0 && str.length >= 3) {
                        if (charIndex == 0) {
                            result = parseFloat(str[index - 1]) / parseFloat(str[index + 1]);
                            str[index + 1] = result;
                            str.splice(index - 1, 2);
                            index = -1;
                        }
                    }
                }
                for (var index = 1; index < str.length; index += 2) {

                    charIndex = expressions.indexOf(str[index]);

                    if (charIndex != -1 && index != 0 && str.length >= 3) {
                        if (charIndex == 1) {
                            result = parseFloat(str[index - 1]) * parseFloat(str[index + 1]);
                            str[index + 1] = result;
                            str.splice(index - 1, 2);
                            index = -1;
                        }
                    }
                }
                for (var index = 1; index < str.length; index += 2) {

                    charIndex = expressions.indexOf(str[index]);

                    if (charIndex != -1 && index != 0 && str.length >= 3) {
                        if (charIndex == 2) {
                            result = parseFloat(str[index - 1]) + parseFloat(str[index + 1]);
                            str[index + 1] = result;
                            str.splice(index - 1, 2);
                            index = -1;
                        }
                    }
                }
                for (var index = 1; index < str.length; index += 2) {

                    charIndex = expressions.indexOf(str[index]);

                    if (charIndex != -1 && index != 0 && str.length >= 3) {
                        if (charIndex == 3) {
                            result = parseFloat(str[index - 1]) - parseFloat(str[index + 1]);
                            str[index + 1] = result;
                            str.splice(index - 1, 2);
                            index = -1;
                        }
                    }
                }

                if (str.length == 1) {
                    result = parseFloat(str[0]);
                }

                if (str.length > 0) {
                    ngModel.$setViewValue(result.round(scope.fraction));
                }

                if (attrs.ngChange && str.length > 1) {
                    console.log(str.length);
                    var ngChange = attrs.ngChange.split('(');
                }
            }

            element.on("focus", function () {
                var viewValue = ngModel.$$rawModelValue;
                var cVal = clearValue(viewValue);
                if (parseFloat(cVal) == 0) {
                    ngModel.$setViewValue("");
                }
            });

            element.on("blur", function () {
                if (scope.calculate)
                    calculte();
                ngModel.$commitViewValue();
                reformatViewValue();
            });

            ngModel.$formatters.unshift(function (value) {
                return $filter('currency')(value, getCurrencySymbol(), scope.fraction);
            });

            ngModel.$validators.min = function (cVal) {
                if (!scope.ngRequired && isNaN(cVal)) {
                    return true;
                }
                if (typeof scope.min !== 'undefined') {
                    return cVal >= parseFloat(scope.min);
                }
                return true;
            };

            scope.$watch('min', function (val) {
                ngModel.$validate();
            });

            ngModel.$validators.max = function (cVal) {
                if (!scope.ngRequired && isNaN(cVal)) {
                    return true;
                }
                if (typeof scope.max !== 'undefined') {
                    return cVal <= parseFloat(scope.max);
                }
                return true;
            };

            scope.$watch('max', function (val) {
                ngModel.$validate();
            });


            ngModel.$validators.fraction = function (cVal) {
                if (!!cVal && isNaN(cVal)) {
                    return false;
                }

                return true;
            };

            scope.$on('currencyRedraw', function () {
                ngModel.$commitViewValue();
                reformatViewValue();
            });

            element.on('focus', function () {
                var viewValue = ngModel.$$rawModelValue;

                if (isNaN(viewValue) || viewValue === '' || viewValue == null) {
                    viewValue = '';
                }
                else {
                    viewValue = parseFloat(viewValue).toFixed(scope.fraction);
                }
                ngModel.$setViewValue(viewValue);
                ngModel.$render();
            });
        }
    }
}]);
