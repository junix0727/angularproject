angular.module('exeApp')
    .controller('WizardController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        $scope.Roles = [];
        $scope.companySelectType = [];
        $scope.UserLevel = [];
        $scope.Superior = [];
        $scope.selectedType = 2;
        $scope.showSelectedType = false;
       
        $scope.refresh = function () {
            $scope.performAction = 'refresh';
            window.location.reload();
        }

        $scope.close = function () {
            window.close();
        }
        performAction = function (action) {
            var params = angular.extend({}, {
                wizard: angular.toJson($scope.data)
            });

            var reqData = {
                url: "/Handlers/DataHandler.ashx?type=UserWizard&action=" + action,
                method: action == "GetWizard" ? "GET" : "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: $.param(params)
            };
            $http(reqData)
                .success(function (data, status, headers, config) {
                    var result = angular.fromJson(data);
                    if (result.IsError && result.Messages) {
                        GlobalUtils.Notify(result.Messages);
                    }
                    else {
                        switch (action) {
                            case "GetWizard":
                                $scope.data = result.Data;
                                $scope.setWizard();
                                $scope.Roles = [
                                    { Id: 1, Description: $scope.data.Local.Bookkeeper },
                                    { Id: 2, Description: $scope.data.Local.Accountant },
                                    { Id: 3, Description: $scope.data.Local.KeyUser },
                                    { Id: 4, Description: $scope.data.Local.Teamleader }
                                ];
                                $scope.companySelectType = [
                                   { Id: 1, Description: $scope.data.Local.SelectByDept },
                                   { Id: 2, Description: $scope.data.Local.SelectIndividual }];
                                $scope.UserLevel = $scope.data.UserLevel;
                                $scope.Superior = $scope.data.Superior;
                                $scope.HasApplicationYCS = $scope.data.HasApplicationYCS;
                                activate();
                                break;
                            case "ValidateStep0":
                            case "ValidateStep1":
                                $scope.step++;
                                $scope.setTitle();
                                $scope.setSubTitle();
                                break;
                            case "Submit":
                                $scope.step++;
                                $scope.setTitle();
                                $scope.setSubTitle();
                                if (result.Messages) {
                                    GlobalUtils.Notify(result.Messages);
                                }
                                break;
                            default:
                        }
                    }
                    $scope.performingAction = false;
                })
                .error(function (data, status, headers, config) {
                    $scope.performingAction = false;
                    var error = [{
                        Style: 'GlobalDanger',
                        Text: 'HTTP ' + status + ' Error. Please contact the administrator.'
                    }];
                    GlobalUtils.Notify(error);
                });
        }        

        $scope.step = 0;

        performAction("GetWizard");       

        $scope.$watch('data.IsLocalAdmin', function (newVal) {

            $scope.isLocalAdminNewVal = newVal;
   
        });

        $scope.$watch('data.selectedCompanies', function (newVal) {

            $scope.selectedCompaniesNewVal = newVal;
   
        });

        $scope.onCountryChanged = function () {
            angular.forEach($scope.data.Countries, function (country) {
                if (country.Id == $scope.data.CountryId) {
                    $scope.data.CountryCode = country.Code;
                    $scope.setRegExpression(country.Code.trim());
                    return;
                }
            });
        }

        $scope.setRegExpression = function (countryCode) {
            //set regex expression for selected country
            switch (countryCode) {
                case "EE":
                    $scope.VatPattern = '[0-9]{9}';
                    $scope.VatLength = 9;
                    $scope.ZipPattern = '[0-9]{5}';
                    $scope.ZipLength = 5;
                    $scope.ZipTooltip = "99999";
                    $scope.IbanPattern = '/[0-9]{2}[0-9]{16}/gi' //16n EEkk bbss cccc cccc cccx
                    $scope.IbanLength = 18;
                case "DE":
                    $scope.VatPattern = '[0-9]{9}';
                    $scope.VatLength = 9;
                    $scope.ZipPattern = '[0-9]{5}';
                    $scope.ZipLength = 5;
                    $scope.ZipTooltip = "99999";
                    $scope.IbanPattern = '/{0-9]{2}[0-9]{18}/gi' //18n DEkk bbbb bbbb cccc cccc cc
                    $scope.IbanLength = 20;
                    break;
                case "BE":
                    $scope.VatPattern = '[0|1][0-9]{9}';
                    $scope.VatLength = 10;
                    $scope.ZipPattern = '[0-9]{4}';
                    $scope.ZipLength = 4;
                    $scope.ZipTooltip = "9999";
                    $scope.IbanPattern = /[0-9]{2}[0-9]{12}/gi //12n BEkk bbbc cccc ccxx
                    $scope.IbanLength = 14;
                    break;
                case "LV":
                    $scope.VatPattern = '[0-9]{11}';
                    $scope.VatLength = 11;
                    $scope.ZipPattern = /[LV-][0-9]{4}/gi;
                    $scope.ZipLength = 7;
                    $scope.ZipTooltip = "LV-9999";
                    $scope.IbanPattern = /[0-9]{2}[a-z]{4}[a-z0-9]{13}/gi //4a,13c LVkk bbbb cccc cccc cccc c
                    $scope.IbanLength = 19;
                    break;
                case "LT":
                    $scope.VatPattern = '[0-9]{9,12}';
                    $scope.VatLength = 12;
                    $scope.ZipPattern = '[0-9]{5}';
                    $scope.ZipLength = 5;
                    $scope.ZipTooltip = "99999";
                    $scope.IbanPattern = /[0-9]{2}[0-9]{16}/gi //16n LTkk bbbb bccc cccc cccc
                    $scope.IbanLength = 18;
                    break;
                case "NL":
                    $scope.VatPattern = '[0-9]{9}[B][0-9]{2}';
                    $scope.VatLength = 12;
                    $scope.ZipPattern = /[0-9]{4}[\s]?[A-Z]{2}/gi;
                    $scope.ZipLength = 7;
                    $scope.ZipTooltip = "9999 AA";
                    $scope.IbanPattern = /[0-9]{2}[a-z]{4}[0-9]{10}/gi //4a,10n NLkk bbbb cccc cccc cc
                    $scope.IbanLength = 16;
                    break;
                case "FR":
                    $scope.VatPattern = '[0-9]{2}[,][0-9]{3}[,][0-9]{3}[,][0-9]{3}';
                    $scope.VatLength = 14;
                    $scope.ZipPattern = '[0-9]{5}';
                    $scope.ZipLength = 5;
                    $scope.ZipTooltip = "99999";
                    $scope.IbanPattern = /[0-9]{2}[0-9]{10}[a-z0-9]{11}[0-9]{2}/gi //10n,11c,2n FRkk bbbb bggg ggcc cccc cccc cxx
                    $scope.IbanLength = 25;
                    break;
                default:
            }
        }



        $scope.next = function () {
            $scope.performingAction = true;
            switch ($scope.step) {
                case 0:                    
                    performAction("ValidateStep0");
                    break;
                case 1:
                    var selectedIds = ($scope.vm.rightValueFull) ? $.map($scope.vm.rightValueFull, function (item) { return item.Id; }) : null;
                    $scope.data.selectedCompanies = selectedIds;
                    performAction("Submit");
                    break;
            }
        };

        $scope.back = function () {
            $scope.performingAction = true;
            $scope.step--;
            $scope.setTitle();
            $scope.setSubTitle();
            $scope.performingAction = false;
        };

        $scope.setTitle = function () {
            switch ($scope.step) {
                case 0:
                    $scope.stepTitle = $scope.data.Local.Step0Title;
                    break;                
                case 1:
                    $scope.stepTitle = $scope.data.Local.Step2Title;
                    break;
                case 2:
                    $scope.stepTitle = $scope.data.Local.Step3Title;
                    break;
                case 3:
                    $scope.stepTitle = $scope.data.Local.Step4Title;
                    break;                
                default:
                    $scope.stepTitle = null;
            }
        }

        $scope.setSubTitle = function () {
            switch ($scope.step) {
                case 0:
                    $scope.stepSubTitle = $scope.data.Local.Step0SubTitle;
                    break;
                case 3:
                    if ($scope.data.IsMailActivation == true) {

                        $scope.stepSubTitle = $scope.data.Local.WizardCompletedText;
                    }
                    else {
                        $scope.stepSubTitle = $scope.data.Local.WizardRegistrationText;
                    }
                default:
                    $scope.stepSubTitle = null;
            }
        }

        $scope.isValid = function () {
            if ($scope.data) {
              
                switch ($scope.step) {
                    case 0:
                        return $scope.data.FullName && $scope.data.fk_language_id && $scope.data.Email && $scope.data.role;
                        return true;
                    case 1:                        
                        if ($scope.isLocalAdminNewVal == false && $scope.data.OrgId != 148) {
                            return $scope.vm.rightValueFull && $scope.vm.rightValueFull.length > 0 ;
                        }else{

                            return true;
                        }
                        break;
                    case 2:
                        return ($scope.data.selectedDepartments && $scope.data.selectedDepartments.length > 0) || $scope.vm1.rightValueFull && $scope.vm1.rightValueFull.length > 0;
                }
                return true;
            }
            return false
        }

        $scope.$watch('data', function (newVal) {
            if (newVal) {
                $scope.isValid();
            }
        }, true);      

        $scope.isNext = function () {
            return $scope.step < 1;
        }

        $scope.setWizard = function () {
            $scope.setTitle();
            $scope.setSubTitle();
        }

        activate = function () {
            $scope.vm = [];
            $scope.vm.leftValue = [];
            $scope.vm.rightValue = [];
            $scope.vm.rightValueFull = [];
            $scope.vm.addValue = [];
            $scope.vm.removeValue = [];

            function loadLeft() {
                $scope.vm.leftValueFull = angular.copy($scope.data.Companies);
                $scope.vm.leftValue = $filter('limitTo')($scope.data.Companies, 100);
                if ($scope.vm.options)
                    $scope.vm.options.leftTotal = $scope.vm.leftValueFull.length;
            }

            $scope.vm.options = {
                leftContainerSearch: function (text) {
                    $scope.vm.leftValue = $filter('filter')($scope.vm.leftValueFull, {
                        'Name': text
                    })
                    $scope.vm.leftValue = $filter('orderBy')($scope.vm.leftValue, ['Name']);
                    $scope.vm.leftValue = $filter('limitTo')($scope.vm.leftValue, 100);
                },
                rightContainerSearch: function (text) {
                    $scope.vm.rightValue = $filter('filter')($scope.vm.rightValueFull, {
                        'Name': text
                    })
                    $scope.vm.rightValue = $filter('orderBy')($scope.vm.rightValue, ['Name']);
                    $scope.vm.rightValue = $filter('limitTo')($scope.vm.rightValue, 100);
                },
                leftContainerLabel: $scope.data ? $scope.data.Local.AvailableLists : "",
                rightContainerLabel: $scope.data ? $scope.data.Local.SelectedLists : "",
                showingLabel: $scope.data ? $scope.data.Local.Showing : "",
                emptylistLabel: $scope.data ? $scope.data.Local.EmptyList : "",
                selectLabel: $scope.data ? $scope.data.Local.MoveSelectedList : "",
                unselectLabel: $scope.data ? $scope.data.Local.RemoveSelectedList : "",
                searchLabel: $scope.data ? $scope.data.Local.Search : "",
                ofLabel: $scope.data ? $scope.data.Local.OfLabel : "",
                leftContainerScrollEnd: 0,
                leftTotal: $scope.vm.leftValueFull ? $scope.vm.leftValueFull.length : 0,
                rightTotal: $scope.vm.rightValueFull ? $scope.vm.rightValueFull.length : 0,
                onMoveRight: function () {
                    $scope.vm.rightValueFull = $scope.vm.rightValueFull.concat($scope.vm.addValue);
                    $scope.vm.leftValueFull = $filter('notInArray')($scope.vm.leftValueFull, $scope.vm.addValue, 'Id');
                    $scope.vm.addValue = [];
                    $scope.vm.options.leftTotal = $scope.vm.leftValueFull.length;
                    $scope.vm.options.rightTotal = $scope.vm.rightValueFull.length;
                    $scope.vm.options.leftContainerSearch('');
                    $scope.vm.options.rightContainerSearch('');
                },
                onMoveLeft: function () {
                    $scope.vm.leftValueFull = $scope.vm.leftValueFull.concat($scope.vm.removeValue);
                    $scope.vm.rightValueFull = $filter('notInArray')($scope.vm.rightValueFull, $scope.vm.removeValue, 'Id');
                    $scope.vm.removeValue = [];
                    $scope.vm.options.leftTotal = $scope.vm.leftValueFull.length;
                    $scope.vm.options.rightTotal = $scope.vm.rightValueFull.length;
                    $scope.vm.options.leftContainerSearch('');
                    $scope.vm.options.rightContainerSearch('');
                }
            };
            if ($scope.data && $scope.data.Companies) {
                loadLeft();
            }
        }

        activate();

        activate1 = function () {
            $scope.vm1 = [];
            $scope.vm1.leftValue = [];
            $scope.vm1.rightValue = [];
            $scope.vm1.rightValueFull = [];
            $scope.vm1.addValue = [];
            $scope.vm1.removeValue = [];

            function loadLeft() {
                $scope.vm1.leftValueFull = angular.copy($scope.data.Departments);
                $scope.vm1.leftValue = $filter('limitTo')($scope.vm1.leftValueFull, 100);
                if ($scope.vm1.options)
                    $scope.vm1.options.leftTotal = $scope.vm1.leftValueFull.length;
            }

            $scope.vm1.options = {
                leftContainerSearch: function (text) {
                    $scope.vm1.leftValue = $filter('filter')($scope.vm1.leftValueFull, {
                        'Name': text
                    })
                    $scope.vm1.leftValue = $filter('orderBy')($scope.vm1.leftValue, ['Name']);
                    $scope.vm1.leftValue = $filter('limitTo')($scope.vm1.leftValue, 100);
                },
                rightContainerSearch: function (text) {
                    $scope.vm1.rightValue = $filter('filter')($scope.vm1.rightValueFull, {
                        'Name': text
                    })
                    $scope.vm1.rightValue = $filter('orderBy')($scope.vm1.rightValue, ['Name']);
                    $scope.vm1.rightValue = $filter('limitTo')($scope.vm1.rightValue, 100);
                },
                leftContainerLabel: $scope.data ? $scope.data.Local.AvailableLists : "",
                rightContainerLabel: $scope.data ? $scope.data.Local.SelectedLists : "",
                showingLabel: $scope.data ? $scope.data.Local.Showing : "",
                emptylistLabel: $scope.data ? $scope.data.Local.EmptyList : "",
                selectLabel: $scope.data ? $scope.data.Local.MoveSelectedList : "",
                unselectLabel: $scope.data ? $scope.data.Local.RemoveSelectedList : "",
                searchLabel: $scope.data ? $scope.data.Local.Search : "",
                ofLabel: $scope.data ? $scope.data.Local.OfLabel : "",
                leftContainerScrollEnd: 0,
                leftTotal: $scope.vm1.leftValueFull ? $scope.vm1.leftValueFull.length : 0,
                rightTotal: $scope.vm1.rightValueFull ? $scope.vm1.rightValueFull.length : 0,
                onMoveRight: function () {
                    $scope.vm1.rightValueFull = $scope.vm1.rightValueFull.concat($scope.vm1.addValue);
                    $scope.vm1.leftValueFull = $filter('notInArray')($scope.vm1.leftValueFull, $scope.vm1.addValue, 'Id');
                    $scope.vm1.addValue = [];
                    $scope.vm1.options.leftTotal = $scope.vm1.leftValueFull.length;
                    $scope.vm1.options.rightTotal = $scope.vm1.rightValueFull.length;
                    $scope.vm1.options.leftContainerSearch('');
                    $scope.vm1.options.rightContainerSearch('');
                },
                onMoveLeft: function () {
                    $scope.vm1.leftValueFull = $scope.vm1.leftValueFull.concat($scope.vm1.removeValue);
                    $scope.vm1.rightValueFull = $filter('notInArray')($scope.vm1.rightValueFull, $scope.vm1.removeValue, 'Id');
                    $scope.vm1.removeValue = [];
                    $scope.vm1.options.leftTotal = $scope.vm1.leftValueFull.length;
                    $scope.vm1.options.rightTotal = $scope.vm1.rightValueFull.length;
                    $scope.vm1.options.leftContainerSearch('');
                    $scope.vm1.options.rightContainerSearch('');
                }
            };
            if ($scope.data && $scope.data.Departments) {
                loadLeft();
            }
        }

        $scope.selectCompanyByDepartment = function (department) {
            $scope.vm.rightValueFull = $filter('equalFilter')($scope.data.Companies, { fk_department_id: department });
            $scope.vm.leftValueFull = $filter('notInArray')($scope.data.Companies, $scope.vm.rightValueFull, 'Id');
            $scope.vm.options.leftTotal = $scope.vm.leftValueFull.length;
            $scope.vm.options.rightTotal = $scope.vm.rightValueFull.length;
            $scope.vm.options.leftContainerSearch('');
            $scope.vm.options.rightContainerSearch('');          
        }

        $scope.selectOptionType = function (type) {
            $scope.showSelectedType = type == 1;
            $scope.selectCompanyByDepartment(type == 1 ? $scope.data.selectedDepartment : 0);
        }
    }]);