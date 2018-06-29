// IMG Framework upload controll plugin;

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "uploadControl",
				defaults = {
				    onfilesDroppedCallBack: undefined,
                    uploadTarget: '/Views/MasterData/DocumentEdit.aspx',
                    progressZoneId: 'dropzoneProgress',
                    dropFilesHereText: 'Drop files here!',
                    uploadInProgressText: 'Upload In Progress...',
                    combineLimit: 5,
                    filenameTrimLimit: 27,
                    uploadSessionKey: undefined
				};

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        dropZone: undefined,
        progressZone: undefined,
        placeholder: undefined,
        uploadedFiles: 0,
        filesDropped: 0,
        dropZoneCombined: false,
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings

            // Initializes the dropZone
            this.dropZone = $(this.element);
            this._initDropZoneMarkup();
            this.progressZone = $('<div id="'+ this.settings.progressZoneId +'"></div>');
            this.progressZone.insertAfter(this.dropZone);
            this.dropZone.removeClass('error');

            // Check if window.FileReader exists to make 
            // sure the browser supports file uploads
            if (typeof (window.FileReader) == 'undefined') {
                this.dropZone.text('Browser Not Supported!');
                this.dropZone.addClass('error');
                return;
            }

            // Add a nice drag effect
            this.dropZone[0].ondragenter = function () {
                $(this).addClass('hover');
                return false;
            };

            this.dropZone[0].ondragover = function () {
                return false;
            };


            // Remove the drag effect when stopping our drag
            this.dropZone[0].ondragend = function () {
                $(this).removeClass('hover');
                return false;
            };

            // The drop event handles the file sending
            this.dropZone[0].ondrop = function (event) {

                //Get plugin data and store it in self variable;
                var self = $.data(this, "plugin_" + pluginName);

                // Stop the browser from opening the file in the window
                event.preventDefault();

                // Report upload in progress
                    self._setUploadStatus(self.settings.uploadInProgressText);

                // Get the file and the file reader
                var files = event.dataTransfer.files;

                // Assign how many files were dropped to a variable
                self.filesDropped = files.length;

                // Reset upload counter files count;
                self.uploadedFiles = 0;

                // Check if we need to combine entries
                self.dropZoneCombined = self.filesDropped > self.settings.combineLimit;

                // Empty the progressZone div
                self.progressZone.empty();
                self._addProgressBars(self.progressZone, files, self.dropZoneCombined)

                // Loop through dropped files
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    var isValidFile = true;
                    var validateError = '';

                    if (file.size > maxRequestLength) {
                        isValidFile = false;
                        validateError = 'Error: File Too Large!'
                    }

                    type = 'application/pdf';
                    var extension = file.name.split('.').pop().toLowerCase();
                    if (isValidFile == true && file.type != type && extension != 'pdf') {
                        isValidFile = false;
                        validateError = 'Error: Only PDF files allowed!'
                    }

                    if (!isValidFile) {
                        
                        self._updateProgressError(i, validateError, file.name);
                        self.uploadedFiles++;
                        continue;
                    }

                    

                    // Send the file
                    self._uploadFile(file, i, self.element, self.settings);

                }



                // A hack to work around dashboard not resizing properly when a lot of files are added;

                if (typeof self.onfilesDroppedCallBack == 'function') {
                    setTimeout(self.onfilesDroppedCallBack, 1000);
                }

                
            }
        },
        _uploadFile: function (file, i, element, settings) {
            
            //get current plugin data and store it in self;
            var self = $.data(element, "plugin_" + pluginName);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (event) {
                if (!self.dropZoneCombined) {
                    self._updateProgress(i, event.loaded , event.total);
                }
            }, false);
            xhr.onreadystatechange = function (event) {
                return function () {
                    if (event.target.readyState == 4) {
                        self.uploadedFiles++;

                        if (event.target.status == 200 || event.target.status == 304) {
                            if (self.dropZoneCombined) {
                                self._updateProgress(i, self.uploadedFiles , self.filesDropped);
                            }
                            else{
                                self._updateProgressCompleted(i);
                            }
                        }


                        else {
                            self._updateProgressError(i,'Error: XMLHttpRequest Error!', file.name);
                        }

                        // If all files have been uploaded show drop files here text
                        if (self.uploadedFiles >= self.filesDropped) {
                            self._updateProgressCompleted(i); // called to update to completed when having combined status bar
                            self._initDropZoneMarkup(); // reset markup;
                            self.dropZone.removeClass('hover');
                        }
                    }
                } (event);
            };
            xhr.open('POST', self.settings.uploadTarget, true);
            xhr.setRequestHeader('X-FILE-NAME', file.name);
            if (self.settings.uploadSessionKey)
                xhr.setRequestHeader('UPL-SESS-KEY', self.settings.uploadSessionKey);
            xhr.send(file);
        },
            
        _addProgressBars: function(progressZone, files, combine){
            if (combine){
                var progressBar = $(
                        '<div class="progress">' +
                        '<div id="uploadProgress" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + files.length + '" style="width: 0%"> ' +
                        '<span id="uploadLabel">Uploading: </span><span id="uploadStatus">0/' + files.length + '</span> ' +
                        '</div>' +
                        '</div>');
                progressZone.append(progressBar);
            }
            else{ // add progress bar for each file;
                 for (var i = 0; i < files.length; i++)
                 {
                    var file = files[i];
                    var progressBar = $(
                        '<div class="progress">' +
                        '<div id="uploadProgress' + i + '" class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%"> ' +
                        '<span id="uploadLabel' + i + '">' + this._trimFileName(file.name) + '</span> <span id="uploadStatus' + i + '">0%</span> ' +
                        '</div>' +
                        '</div>');
                    progressZone.append(progressBar);
                 }
            }
        },

        _updateProgress: function(seqNr, loaded , total)
        {
            var percentage = parseInt(loaded / total * 100) + '%';
            if (this.dropZoneCombined)
            {
                this.progressZone.find('#uploadProgress').css('width', percentage);
                this.progressZone.find('#uploadStatus').text(loaded + '/' + total);
            }
            else
            {
                this.progressZone.find('#uploadProgress' + seqNr).css('width', percentage);
                this.progressZone.find('#uploadStatus' + seqNr).text(percentage);
            }
        },

        _updateProgressCompleted:function (seqNr)
        {
            if (this.dropZoneCombined)
            {
                this.progressZone.find('#uploadProgress').css('width', '100%').removeClass('progress-bar-info').addClass('progress-bar-success');;
                this.progressZone.find('#uploadStatus').text('');
                this.progressZone.find('#uploadLabel').text('Upload Complete.');
            }
            else
            {
                this.progressZone.find('#uploadProgress' + seqNr).css('width', '100%').removeClass('progress-bar-info').addClass('progress-bar-success');;
                this.progressZone.find('#uploadStatus' + seqNr).text('Upload Complete.');
            }

        },

        _updateProgressError: function (seqNr, errMsg, fileName)
        {
            if (this.dropZoneCombined)
            {
                var progressBar = $(
                        '<div class="progress">' +
                        '<div id="uploadProgress' + seqNr + '" class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"> ' +
                        '<span id="uploadLabel' + seqNr + '">' + fileName + ' </span> <span id="uploadStatus' + seqNr + '">' + errMsg + '</span> ' +
                        '</div>' +
                        '</div>');
                    this.progressZone.append(progressBar);
            }
            else
            {
                this.progressZone.find('#uploadProgress' + seqNr).css('width', '100%').removeClass('progress-bar-info').addClass('progress-bar-danger');
                this.progressZone.find('#uploadStatus' + seqNr).text(errMsg);
            }
        },

        _initDropZoneMarkup: function()
        {
             this.dropZone.empty();
             this.dropZone.append('<h5 class="text-center" id="uploadStatusContainer"><span class="glyphicon glyphicon-download-alt"></span> <span>' + this.settings.dropFilesHereText + '</span></h5>');
        },

        _setUploadStatus: function(text)
        {
            this.dropZone.find('#uploadStatusContainer').html('<span>' + text + '</span>')
        },

        _trimFileName: function(sentSting) {
            var limit = this.settings.filenameTrimLimit;
            var newString;
            if (sentSting.length > limit) {
                newString = sentSting.substring(0, limit) + '...';
            } else {
                newString = sentSting;
            }
            return newString;
        }

    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });

        // chain jQuery functions
        return this;
    };

})(jQuery, window, document);