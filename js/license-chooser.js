var share_derivatives = 'yes';
var non_commercial = false;

var work_format = null;
var metadata_format = null;

var ccid_login = false;
var file_uploaded = 'no';

///////////////////////////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////////////////////////

var scrollTo = function (selector) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top
  }, 500);
};

///////////////////////////////////////////////////////////////////////////////
// File uploading
///////////////////////////////////////////////////////////////////////////////

var uploadFile = function(file) {
  console.log(file);
  file_uploaded = 'yes'; // Should be 'uploading...'
};

var initializeFileUploadForm = function () {
  $('#upload-form').on('submit', function(e) {
    var file = $('#upload-file').files[0];
    e.preventDefault();
    uploadFile(file);
  });
};

var initializeFileWell = function () {
  var file_well = $('#file-well');

  file_well.on('drop', function (e) {
    e.preventDefault();
    $(this).removeClass('active');
    uploadFile(e.dataTransfer.files);
  });

  file_well.on('dragover', function () {
    $(this).addClass('active');
    return false;
  });

  file_well.on('dragleave', function () {
    $(this).removeClass('active');
    return false;
  });
};

var initializeFileUpload = function () {
  initializeFileUploadForm();
  initializeFileWell();
};

////////////////////////////////////////////////////////////////////////////////
// Metadata generation
////////////////////////////////////////////////////////////////////////////////

var generateMetadata = function () {
  var work_title = $("#work-name").val();
  var attribution_name = $("#attribution-name").val();
  var attribution_url = $("#attribution-url").val();
  var derived_work_url = $("#derived-work-url").val();
  var more_permissions_url = $("#more-permissions-url").val();
  return work_title + " " +
    attribution_name + " " +
    attribution_url + " " +
    derived_work_url + " " +
    more_permissions_url + " " +
    "as " + metadata_format;
};

var regenerateMetadata = function() {
  $('#metadata-text').val(generateMetadata());
};

////////////////////////////////////////////////////////////////////////////////
// UI Events affecting appearance and state
////////////////////////////////////////////////////////////////////////////////

var linkRevealer = function(toggleName, entityName) {
  var entity = $(entityName);
  $(toggleName).on('click', function(e) {
    e.preventDefault();
    entity.toggleClass('hidden');
  });
  entity.addClass('hidden');
};

var workFormatSetter = function() {
  work_format = $(this).html();
  $('#work-format-button').html(work_format +
                                '&nbsp;<span class="caret"></span>');
  return true;
};

var metadataFormatSetter = function() {
  metadata_format = $(this).html();
  $('#metadata-format-button').html(metadata_format +
                                    '&nbsp;<span class="caret"></span>');
  regenerateMetadata();
  return true;
};

var userChangedOriginalWork = function () {
  $('.original-work-item').removeClass('active');
  $(this).addClass('active');
  // Handle the result
  generateMetadata();
  scrollTo("#sharing-panel");
  return true;
};

var setLicenseIsFree = function (free) {
  $('.license-freedom').hide();
  if (free) {
    $('#license-free').show();
  } else {
    $('#license-nonfree').show();
  }
};

var setLicenseSelected = function (license) {
  $('.license-choice').removeClass('active');
  $('#' + license).addClass('active');
};

var updateLicenseChoice = function () {
  switch (share_derivatives) {
  case 'no':
    switch (non_commercial) {
    case true:
      setLicenseSelected('cc-by-nc-nd');
      setLicenseIsFree(false);
      break;
    case false:
      setLicenseSelected('cc-by-nd');
      setLicenseIsFree(false);
      break;
    }
    break;
  case 'yes':
    switch (non_commercial) {
    case true:
      setLicenseSelected('cc-by-nc');
      setLicenseIsFree(false);
      break;
    case false:
      setLicenseSelected('cc-by');
      setLicenseIsFree(true);
      break;
    }
    break;
  case 'alike':
    switch (non_commercial) {
    case true:
      setLicenseSelected('cc-by-nc-sa');
      setLicenseIsFree(false);
      break;
    case false:
      setLicenseSelected('cc-by-sa');
      setLicenseIsFree(true);
      break;
    }
    break;
  }
};

var updateLicenseElements = function (element) {
  var license = $(element).attr('id');
  $('.nc-item').removeClass('active');
  $('.sa-item').removeClass('active');
};

var setShareDerivatives = function (sa) {
  $('.sa-item').removeClass('active');
  switch (sa) {
  case 'share-no':
    share_derivatives = 'no';
    $('#share-no').addClass('active');
    break;
  case 'share-yes':
    share_derivatives = 'yes';
    $('#share-yes').addClass('active');
    break;
  case 'share-alike':
    share_derivatives = 'alike';
    $('#share-alike').addClass('active');
    break;
  }
};

var userChangedShareDerivatives = function () {
  var share = $(this).attr('id');
  setShareDerivatives(share);
  updateLicenseChoice();
  generateMetadata();
  scrollTo('#commercial-panel');
  return true;
};

var setNonCommercial = function (nc) {
  non_commercial = nc;
  $('.nc-item').removeClass('active');
  if (nc) {
    $('#commercial-no').addClass('active');
  } else {
    $('#commercial-yes').addClass('active');
  }
};

var userChangedNonCommercial = function () {
  var nc = ($(this).attr('id') == 'commercial-no');
  setNonCommercial(nc);
  updateLicenseChoice();
  generateMetadata();
  scrollTo('#license-panel');
  return true;
};

var userChangedLicense = function () {
  $('.license-choice').removeClass('active');
  var element = $(this);
  element.addClass('active');
  var license = element.attr('id');
  switch (license) {
  case 'cc-by':
    setNonCommercial(false);
    setShareDerivatives('yes');
    setLicenseIsFree(true);
    break;
  case 'cc-by-sa':
    setNonCommercial(false);
    setShareDerivatives('alike');
    setLicenseIsFree(true);
    break;
  case 'cc-by-nc':
    setNonCommercial(true);
    setShareDerivatives('yes');
    setLicenseIsFree(false);
    break;
  case 'cc-by-nd':
    setNonCommercial(false);
    setShareDerivatives('no');
    setLicenseIsFree(false);
    break;
  case 'cc-by-nc-sa':
    setNonCommercial(true);
    setShareDerivatives('alike');
    setLicenseIsFree(false);
    break;
  case 'cc-by-nc-nd':
    setNonCommercial(true);
    setShareDerivatives('no');
    setLicenseIsFree(false);
    break;
  }
  generateMetadata();
  scrollTo('#attribution-panel');
};

////////////////////////////////////////////////////////////////////////////////
// Main flow of execution
////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  initializeFileUpload();
  $('.original-work-item').on('click', userChangedOriginalWork);
  $('.sa-item').on('click', userChangedShareDerivatives);
  $('.nc-item').on('click', userChangedNonCommercial);
  $('.license-choice').on('click', userChangedLicense);
  setLicenseIsFree(true);
  metadata_format = $('#metadata-format-button').html;
  $('.set-metadata-format').on('click', metadataFormatSetter);
  $('.set-work-format').on('click', workFormatSetter);
  linkRevealer('#ccid-what', '#ccid-help');
  linkRevealer('#upload-what', '#upload-help');
  linkRevealer('#original-what', '#original-help');
  linkRevealer('#nc-what', '#nc-help');
  linkRevealer('#sa-what', '#sa-help');
  linkRevealer('#license-what', '#license-help');
  linkRevealer('#details-what', '#details-help');
  linkRevealer('#metadata-what', '#metadata-help');
});
