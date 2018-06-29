module.exports = function(grunt) {
	
	var path = require('path');
	
	// Load up them tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-liquibase');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-run');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
	jshint: {
		all: ['Gruntfile.js'],
		options: {
			globals: {
				$:true,
				jQuery: true,
				console: true,
			}
		}
	},
	
	less: {
		dev: {
			files: {
				"Assets/css/site_master.css": "Assets/less/site_master.less",
				"Assets/css/logon.css": "Assets/less/logon.less"                    
			}
		},
	},
	
	watch: {
		styles: {
			files: ['Assets/less/*.less'], // which files to watch
			tasks: ['less:dev', 'cssmin:target'],
			options: {
				nospawn: true
			}
		},
		javascript: {
			files: ['Assets/js/**/*.js'], // which files to watch
			tasks: ['uglify:build'],
			options: {
				nospawn: true
			}
		},
	},
		
    uglify: {
		build: {
			files: {
					'Assets/Vendor/js/components_base_header.min.js': [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/angular/angular.js',
						'bower_components/angular-route/angular-route.js',
						'bower_components/angular-aria/angular-aria.js',
						'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
						'bower_components/bootstrap/dist/js/bootstrap.js',
						'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
						'bower_components/jquery-ui/jquery-ui.js',
						'bower_components/jquery-validate/dist/jquery.validate.js',
						'bower_components/jquery-validate/dist/additional-methods.js',
						'bower_components/notifyjs/dist/notify.js',
						'bower_components/angular-file-upload/dist/angular-file-upload.js',
						'bower_components/angular-ui-select/dist/select.js',
						'bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
						'bower_components/angular-bootstrap-grid-tree/src/tree-grid-directive.js',
						'bower_components/bootstrap-duallistbox/src/jquery.bootstrap-duallistbox.js',
						'bower_components/angular-bootstrap-duallistbox/dist/angular-bootstrap-duallistbox.min.js',
						'bower_components/ng-idle/angular-idle.min.js',
						'bower_components/money.js/money.min.js',
						'bower_components/angular-input-masks/angular-input-masks-standalone.js',
						'bower_components/ng-duallist/ngduallist.js'
					],
					'Assets/js/site.min.js': [
						'Assets/js/searchbox.js',
						'Assets/js/lya-portal.js',
						'Assets/js/gridview.js',
						'Assets/js/ng/directive/ngButtonConfig.js',
						'Assets/js/ng/directive/ngConfirmOnExit.js',
						'Assets/js/ng/controller/TranslationCtrl.js',
						'Assets/js/ng/directive/ngTranslationControl.js',
						'Assets/js/ng/controller/PopupOurReferenceCtrl.js',
						'Assets/js/ng/controller/InvoiceHistoryPopupCtrl.js',
						'Assets/js/ng/controller/CustomizationCtrl.js',
						'Assets/js/ng/controller/PopupCtrl.js',
						'Assets/js/ng/controller/DuplicateCtrl.js',
						'Assets/js/ng/controller/bookingPopupCtrl.js',
						'Assets/js/ng/directive/ngSummaryPanel.js',
						'Assets/js/ng/directive/ngSearchBox.js',
						'Assets/js/ng/factory/SearchService.js',
						'Assets/js/ng/filter/propsFilter.js',
						'Assets/js/ng/filter/equalFilter.js',
						'Assets/js/ng/filter/notInArrayFilter.js',
						'Assets/js/ng/directive/ngFinancialPeriod.js',
						'Assets/js/ng/filter/ellipsisFilter.js',
						'Assets/js/ng/filter/vatSalesFilter.js',
						'Assets/js/ng/filter/countryTypeFilter.js',
						'Assets/js/ng/directive/ngRedirect.js',
						'Assets/js/ng/directive/ngNumber.js',
						'Assets/js/ng/directive/ngEnter.js',
						'Assets/js/ng/directive/ngValidateDate.js',
						'Assets/js/ng/filter/codeDescriptionFilter.js',
						'Assets/js/ng/filter/codeFirmNameFilter.js',
						'Assets/js/ng/filter/dateParser.js',
						'Assets/js/ng/filter/uniqueFilter.js',
						'Assets/js/ng/factory/RequestDataService.js',
						'Assets/js/ng/filter/percentageFilter.js',
						'Assets/js/ng/controller/PopupSelectOrdersCtrl.js',
						'Assets/js/ng/directive/ngHomepage.js',
						'Assets/js/ng/controller/PopupUpdateEntryCtrl.js',
						'Assets/js/ng/directive/ngDatepickerLocal.js',
						'Assets/js/ng/directive/ngNotification.js',
						'Assets/js/ng/directive/ngAutofocus.js',
						'Assets/js/ng/filter/trimFilter.js',
						'Assets/js/ng/factory/TableParameters.js',
						'Assets/js/ng/factory/VATMatrix.js',
						'Assets/js/ng/filter/numberPadding.js',
						'Assets/js/ng/controller/PopReopen.js',
						'Assets/js/ng/controller/PopupCreateModal.js',
						'Assets/js/ng/controller/PopupSelectUser.js',
						'Assets/js/ng/controller/PopupDuplicateWarningCtrl.js',
						'Assets/js/ng/controller/PopupSendToAccountCtrl.js',
						'Assets/js/ng/controller/PopupBankDetailsCtrl.js',
						'Assets/js/ng/controller/DisabledMesagesPopupCtrl.js',
						'Assets/js/ng/factory/TranslateService.js',
						'Assets/js/ng/controller/PopupSyncPeriods.js',
						'Assets/js/ng/controller/PopupExchangeRateCtrl.js',
						'Assets/js/ng/directive/ngCurrency.js',
						'Assets/js/ng/directive/ngUiSelectPopupExt.js',
						'Assets/js/ng/controller/SearchGridTemplateCtrl.js',
						'Assets/js/ng/controller/RoboticDescriptionMaintenanceCtrl.js',
						'Assets/js/ng/controller/SplitPopupCtrl.js',
						'Assets/js/textAngular-dropdownToggle.js',
						'Assets/js/textAngularSetup.js',
						'Assets/js/timepicker.min.js'
					],
                },
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				}
			}
	},
	
	cssmin: {
            options: {
                sourceMap: true,
                cwd: 'Assets/Vendor/css/'
            },
            target: {
                files: [{
                    'Assets/Vendor/css/components_main.min.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'bower_components/ng-table/dist/ng-table.css',
                        'bower_components/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css',
                        'Assets/css/site_master.css',
                        'bower_components/jquery-ui/themes/base/all.css',
                        'bower_components/font-awesome/css/font-awesome.css',
                        'bower_components/angular-ui-select/dist/select.css',
                        'bower_components/bootstrap-duallistbox/src/bootstrap-duallistbox.css',
                        'bower_components/angular-bootstrap-grid-tree/src/treeGrid.css',
                        'bower_components/textAngular/dist/textAngular.css',
                        'bower_components/angular-hotkeys/build/hotkeys.min.css',
                        'bower_components/ng-duallist/ngduallist.css',
                        'Assets/css/timepicker.min.css'
                    ]
                }]
            }
	}
	
  });

  // Default task(s).
  grunt.registerTask('build:dev', ['uglify:build', 'less:dev', 'cssmin']);
  grunt.registerTask('default', ['build:dev']);

};