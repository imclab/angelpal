var CLIENT_ID = '186922574037-2jq7im9acmimrs5oa5rfdec50fq2bbph.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
  window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
      handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authButton = $('#authorizeButton');
  var myDocuments = $('#myDocuments');
  var filePicker = $('#filePicker');
  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.
    myDocuments.removeClass('hide');
    filePicker.onchange = uploadFile;
  } else {
    // No access token could be retrieved, show the button to start the authorization flow.
    authButton.removeClass('hide');
    authButton.onclick = function() {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    };
  }
}

/**
 * Start the file upload.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function uploadFile(evt) {
  gapi.client.load('drive', 'v2', function() {
    var file = evt.target.files[0];
    insertFile(file);
  });
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.name,
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
  }
}





// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
  gapi.load('picker', {'callback': createPicker});
}

// Use your own API developer key.
var developerKey = 'AIzaSyAc5sD5qFnI5ttOdnii879x_RCzbzr9G8Q';

// Create and render a Picker object for searching images.
function createPicker() {
  var view = new google.picker.View(google.picker.ViewId.DOCS);
  view.setMimeTypes("image/png,image/jpeg,image/jpg");
  var picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId('186922574037-2jq7im9acmimrs5oa5rfdec50fq2bbph.apps.googleusercontent.com')
      // .setOAuthToken(AUTH_TOKEN) //Optional: The auth token used in the current Drive API session.
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      // .setDeveloperKey(developerKey)
      .setCallback(pickerCallback)
      .build();
   picker.setVisible(true);
}

// A simple callback implementation.
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    downloadFile(fileId, function (result) {
      console.log(result);
    });
  }
}


/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(fileId, callback) {
  var downloadUrl = "https://www.googleapis.com/drive/v2/files/" + fileId;
  var accessToken = gapi.auth.getToken().access_token;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', downloadUrl);
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xhr.onload = function() {
    callback(xhr.responseText);
  };
  xhr.onerror = function() {
    callback(null);
  };
  xhr.send();
}
