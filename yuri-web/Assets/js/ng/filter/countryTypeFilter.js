exeApp.filter('countryTypeFilter', function () {
    var EUCountries = [
        'AT', 'HR', 'BG', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
        'MT', 'PO', 'RO', 'SK', 'SI', 'SE', 'CY', 'DE', 'NL', 'PT', 'ES', 'GB', 'BE'
    ];

    return function (row, code) {
        if (code == null) {
            return 'outside';
        }

        if (code.trim() == 'BE') {
            return 'BE';
        }

        if (code.trim() == 'EU') {
            return 'EU';
        }

        if (EUCountries.indexOf(code.trim()) != -1) {
            return 'EU';
        }

        return 'outside';
    };
})