angular.module('exeApp')
    .factory('SearchService', function ($http) {
        getSearchValues = function (qry, type, hasNone, hasAddNew, addNewLink, level, filter, showAll) {
            return $http.get('/Handlers/SearchHandler.ashx', {
                params: {
                    query: qry,
                    type: type,
                    none: hasNone,
                    addNew: hasAddNew,
                    link: addNewLink,
                    level: level,
                    filter: filter,
                    showAll: showAll
                }
            })
            .then(function ($response) {
                return $response.data;
            });
        };

        getSingleData = function (id, type, hasAddNew, addNewLink, filter, text) {
            if (isNaN(id)) {
                return;
            }

            var parameters = {
                params: {
                    id: id,
                    type: type,
                    addNew: hasAddNew,
                    link: addNewLink,
                    filter: filter,
                    text: text
                }
            };

            return $http.get('/Handlers/SearchHandler.ashx', parameters)
                .then(function ($response) {
                    return $response.data;
                });
        };

        formEditUrl = function (base, id) {
            if (id) {
                return base + '?id=' + id;
            }

            return url;
        };

        return function () {
            this.getJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.JournalSearchBox');
            };

            this.getBankJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.BankJournalSearchBox');
            };

            this.getPeriodYear = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PeriodYearSearchBox');
            };

            this.getPeriodEntry = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PeriodEntrySearchBox');
            };

            this.getVATPeriod = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PeriodYearSearchBox');
            };

            this.getGLAccounts = function (qry, hasAddNew, hasNone, filter, showAll) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                var none = (hasNone) ? hasNone : false;
                filter = (filter) ? filter : 0;
                var displayAll = (showAll) ? showAll : false;
                return getSearchValues(qry, 'IBA.Library.Controls.GLAccountSearchBox', none, addNew, '/Views/MasterData/GLAccountEdit.aspx', null, filter, displayAll);
            };

            this.getAnalyticals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.AnalyticalSearchBox');
            };

            this.openGLAccount = function (id) {
                window.open(formEditUrl('/Views/MasterData/GLAccountEdit.aspx', id));
            };

            this.openDepreciation = function (id) {
                window.open(formEditUrl('/Views/MasterData/DepreciationMethodEdit.aspx', id));
            };

            this.getAccounts = function (qry, hasNone) {
                var none = (hasNone) ? hasNone : false;
                return getSearchValues(qry, 'IBA.Library.Controls.AccountSearchBox', none);
            };

            this.openAccount = function (id) {
                window.open(formEditUrl('/Views/MasterData/SupplierCustomerEdit.aspx', id));
            };

            this.getClassifications = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.ClassificationSearchBox');
            };

            this.openClassification = function (id) {
                window.open(formEditUrl('/Views/MasterData/ClassificationEdit.aspx', id));
            };

            this.getCostCentres = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.CostCentreSearchBox');
            };

            this.openCostCentre = function (id) {
                window.open(formEditUrl('/Views/MasterData/AnalyticalEdit.aspx?costcentre=true', id));
            };

            this.getCostUnits = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.CostUnitSearchBox');
            };

            this.openCostUnit = function (id) {
                window.open(formEditUrl('/Views/MasterData/AnalyticalEdit.aspx?costcentre=false', id));
            };

            this.getCustomers = function (qry, hasAddNew) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                return getSearchValues(qry, 'IBA.Library.Controls.CustomerSearchBox', false, addNew, '/Views/MasterData/CustomerEdit.aspx');
            };

            this.openCustomer = function (id) {
                window.open(formEditUrl('/Views/MasterData/CustomerEdit.aspx', id));
            };

            this.getDocuments = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.DocumentSearchBox', true);
            };

            this.openDocument = function (id) {
                window.open(formEditUrl('/Views/MasterData/ExchangeRateEdit.aspx', id));
            };

            this.getOutstandingItems = function (qry, hasNone) {
                var none = (hasNone) ? hasNone : false;
                return getSearchValues(qry, 'IBA.Library.Controls.OutstandingItemSearchBox', none);
            };

            this.getReferences = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.ReferenceSearchBox');
            };

            this.getPaymentConditions = function (qry, hasAddNew) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                return getSearchValues(qry, 'IBA.Library.Controls.PaymentConditionSearchBox', false, addNew, '/Views/MasterData/PaymentCondEdit.aspx');
            };

            this.openPaymentCondition = function (id) {
                window.open(formEditUrl('/Views/MasterData/PaymentCondEdit.aspx', id));
            };

            this.getPurchaseJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PurchaseJournalSearchBox');
            };

            this.getPurchaseOrderJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PurchaseOrderJournalSearchBox');
            };

            this.getSalesJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.SalesJournalSearchBox');
            };

            this.getSalesOrderJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.SalesOrderJournalSearchBox');
            };
            this.getSectors = function (qry, showAll) {
                var displayAll = (showAll) ? showAll : false;
                return getSearchValues(qry, 'MFP.Library.Controls.SectorSearchBox', false, false, false, undefined, undefined, displayAll);
            };

            this.getSuppliers = function (qry, hasAddNew) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                return getSearchValues(qry, 'IBA.Library.Controls.SupplierSearchBox', false, addNew, '/Views/MasterData/SupplierEdit.aspx');
            };

            this.openSupplier = function (id) {
                window.open(formEditUrl('/Views/MasterData/SupplierEdit.aspx', id));
            };

            this.getVATCodes = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.VATCodeSearchBox');
            };

            this.openVATCode = function (id) {
                window.open(formEditUrl('/Views/MasterData/VATCodeEdit.aspx', id));
            };

            this.getVATPercentages = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.VATPercentageSearchBox');
            };

            this.getPeriodEntries = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PeriodEntrySearchBox');
            };

            this.getPeriodYears = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.PeriodYearSearchBox');
            };

            this.getVATPeriodEntries = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.VATPeriodEntrySearchBox');
            };

            this.openVATPercentage = function (id) {
                window.open(formEditUrl('/Views/MasterData/VATPercEdit.aspx', id));
            };

            this.getCompanies = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.CompanySearchBox');
            };

            this.getCountries = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.CountrySearchBox');
            };

            this.getAllCompanies = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.SearchCompaniesBox');
            };

            this.getCompanyById = function (id) {
                return getSingleData(id, 'MFP.Library.Controls.SearchCompaniesBox');
            };
            
            this.getCurrencies = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.CurrencySearchBox');
            };

            this.getDepartments = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.DepartmentSearchBox');
            };

            this.getLanguages = function (qry) {
                return getSearchValues(qry, 'MFP.Library.Controls.LanguageSearchBox');
            };

            this.getProfileOrgDepartments = function (qry, hasNone) {
                var none = (hasNone) ? hasNone : false;
                return getSearchValues(qry, 'MFP.Library.Controls.ProfileOrgDepartmentSearchBox', none);
            };

            this.getUsers = function (qry, hasNone) {
                var none = (hasNone) ? hasNone : false;
                return getSearchValues(qry, 'MFP.Library.Controls.UserSearchBox', none);
            };

            this.openUser = function (id) {
                window.open(formEditUrl('/Views/MasterData/UserEdit.aspx', id));
            }

            this.getVatReturnBoxes = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.VATReturnSearchBox');
            };

            this.getGLAccountClassifications = function (qry, hasAddNew) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                return getSearchValues(qry, 'IBA.Library.Controls.GLAccountClassificationSearchBox', false, false, '/Views/MasterData/GLAccountClassificationEdit.aspx');
            };

            this.getGLAccountScheme = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.GLAccountSchemeSearchBox');
            };

            this.openGLAccountScheme = function (id) {
                window.open(formEditUrl('/Views/MasterData/GLAccountSchemeEdit.aspx', id));
            };

            this.getGLAccountClass = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.GLAccountClassSearchBox');
            };

            this.getGeneralJournals = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.GeneralJournalSearchBox');
            };

            this.getOutstandingItems = function (qry, hasNone) {
                var none = (hasNone) ? hasNone : false;
                return getSearchValues(qry, 'IBA.Library.Controls.OutstandingItemSearchBox', none);
            };

            this.getSingleAnalytical = function (id) {
                return getSingleData(id, 'IBA.Library.Controls.AnalyticalSearchBox');
            };

            this.getSingleSupplier = function (id) {
                return getSingleData(id, 'IBA.Library.Controls.SupplierSearchBox');
            };

            this.getSingleGLAccount = function (id, filter) {
                filter = (filter) ? filter : 0;
                return getSingleData(id, 'IBA.Library.Controls.GLAccountSearchBox', null, null, filter);
            };

            this.getSingleCustomer = function (id) {
                return getSingleData(id, 'IBA.Library.Controls.CustomerSearchBox');
            };

            this.getSingleCompany = function (id) {
                return getSingleData(id, 'MFP.Library.Controls.CompanySearchBox');
            };

            this.getSingleAccount = function (id) {
                return getSingleData(id, 'IBA.Library.Controls.AccountSearchBox');
            };

            this.getSingleUser = function (id) {
                return getSingleData(id, 'MFP.Library.Controls.UserSearchBox');
            };

            this.getSingleSector = function (id) {
                return getSingleData(id, 'MFP.Library.Controls.SectorSearchBox');
            };

            this.getBankDetails = function (id, hasAddNew) {
                var addNew = (hasAddNew) ? hasAddNew : false;
                return getSingleData(id, 'IBA.Library.Controls.BankDetailSearchBox', addNew, '/Views/MasterData/BankDetailEdit.aspx?accountId=' + id);
            };

            this.getSingleVATPerc = function (id) {
                return getSingleData(id, 'MFO.Library.Controls.VATPercentageSearchBox');
            };

            this.getAccountProposal = function (qry, accountid) {
                var accountid = accountid ? accountid : 0;
                return getSearchValues(qry, 'IBA.Library.Controls.AccountProposalSearchBox', false, false, '', null, accountid);
            };

            this.getSingleDepartment = function (id) {
                return getSingleData(id, 'MFP.Library.Controls.ProfileOrgDepartmentSearchBox');
            };

            this.getTitle = function (qry) {
                return getSearchValues(qry, 'IBA.Library.Controls.TitleSearchBox');
            };

            this.getRoboticMaintenanceText = function (id, showAll, isArticle, text) {
                return getSingleData(id, 'MFP.Library.Controls.RoboticMaintenanceDescriptionSearchBox', false, '', isArticle, text);
            };
        };
    });
