exeApp.filter('vatSalesFilter', function () {

    var vatCodesBE = [1, 11, 21, 22, 23, 24, 44, 57];
    var vatCodesEU = [1, 11, 21, 22 ,23, 24, 44, 51, 52, 53, 54, 55, 56, 57];
    var vatCodes = [1, 11, 21, 22, 23, 24, 44, 71];

    var empty = [22, 23, 24];

    var vats = [
        {
            Code: 1,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '00',
                    SalesCredit: '49'
                },
                {
                    Code: 0.06,
                    SalesNormal: '01',
                    SalesCredit: '49'
                },
                {
                    Code: 0.12,
                    SalesNormal: '02',
                    SalesCredit: '49'
                },
                {
                    Code: 0.21,
                    SalesNormal: '03',
                    SalesCredit: '49'
                }
            ]
        }, {
            Code: 11,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '54',
                    SalesCredit: '49'
                }
            ]
            //VatPercentages: null,
            //SalesNormal: 54,
            //SalesCredit: 49
        }, {
            Code: 21,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '45',
                    SalesCredit: '49'
                }
            ]
            //VatPercentages: null,
            //SalesNormal: '45',
            //SalesCredit: '49'
        }, {
            Code: 44,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '00',
                    SalesCredit: '49'
                }
            ]
        }, {
            Code: 51,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '46',
                    SalesCredit: '48'
                }
            ]
            //VatPercentages: null,
            //SalesNormal: '46',
            //SalesCredit: '48'
        }, {
            Code: 56,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '47',
                    SalesCredit: '48'
                }
            ]
            //VatPercentages: null,
            //SalesNormal: '47',
            //SalesCredit: '48'
        }, {
            Code: 57,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '44',
                    SalesCredit: '48'
                }
            ]
            //VatPercentages: null,
            //SalesNormal: '44',
            //SalesCredit: '48'
        }, {
            Code: 2,
            VatPercentages: [
                {
                    Code: 0,
                    SalesNormal: '45',
                    SalesCredit: '49'
                }
            ]
        }, {
            Code: '',
            VatPercentages: null,
            SalesNormal: '47',
            SalesCredit: '49'
        }
    ];

    return function (row, code, type, percCode, typeOfCountry) {
        var data = [];
        if (type == 'list') {
            var BE = "BE";
            var EU = "EU";

            if (typeOfCountry.trim() == BE) {
                data = vatCodesBE;
            } else if (typeOfCountry.trim() == EU) {
                data = vatCodesEU;
            } else {
                data = vatCodes;
            }
        } else if (type == 'default') {
            angular.forEach(vats, function (vatCode) {
                if (vatCode.Code.toString().trim() == code) {
                    data = vatCode;
                }
            });

            if (data.length == 0 && empty.indexOf(code) == -1) {
                data = vats[vats.length - 1];
            }

        } else {
            angular.forEach(vats, function (vatCode) {
                if (vatCode.Code.toString().trim() == code) {
                    if (vatCode.VatPercentages != null) {
                        angular.forEach(vatCode.VatPercentages, function (perc) {
                            if (perc.Code == percCode) {
                                data = perc;
                            }
                        });
                    } else {
                        data = vatCode;
                    }
                }
            });

            if (data.length == 0) {
                data = vats[vats.length - 1];
            }
        }

        return data;
    }
})
