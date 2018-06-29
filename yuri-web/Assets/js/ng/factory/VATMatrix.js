exeApp.factory('VATMatrix', function ($filter) {
    var europeanUnionCountries = [
        'AT', 'HR', 'BG', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
        'MT', 'PO', 'RO', 'SK', 'SI', 'SE', 'CY', 'DE', 'NL', 'PT', 'ES', 'GB', 'BE'
    ];

    var VATMatrix = function (vatCodes, country, companyCountry, transactionType) {
        this.isSameCountry = country.trim() == companyCountry.trim();
        this.transactionType = transactionType;
        this.country = country.trim();
        this.vatCodes = vatCodes;
    };

    getFilteredList = function (list, transactionType) {
        var result = [];

        angular.forEach(list, function (item) {
            if (item.TransactionType == transactionType || item.TransactionType == 2) {
                result.push(item);
            }
        });

        return result;
    };

    VATMatrix.prototype = {
        getVATCodeList: function () {
            var vatCodes = getFilteredList(this.vatCodes, this.transactionType);

            if (this.isSameCountry) {

                return $filter('filter')(vatCodes, { IsSameCountry: true });
            }

            if (europeanUnionCountries.indexOf(this.country) != -1) {

                return $filter('filter')(vatCodes, { IsEU: true });
            }

            return $filter('filter')(vatCodes, { IsNotEU: true });
        },
        getSingleVATCode: function (id) {
            var result = $filter('equalFilter')(this.vatCodes, { Id: id });

            return result[0];
        }
    };

    return VATMatrix;
});
