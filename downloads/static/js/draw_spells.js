
  function submitSpellForm(){
    $('form#new-spell').submit(function (e) {
      var formURL = $(this).attr('action');
      var formType = $(this).attr('method');
      var text = $('input#text').val();
      var useBlackBg = $('input#use_black_bg').val();
      var useMultipleCompass = $('input#use_multiple_compass').val();
      var postData = {
                    'text': text,
                    'use_black_bg': useBlackBg,
                    'use_multiple_compass':useMultipleCompass
                   };
      $.ajax(
        {
          type: formType,
          url: formURL,
          traditional: true,
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify(postData),
          dataType : "json",
          success: function (data) {
            if (data['errcode'] === 0) {
              $('#spell-img-container').html(data['spells']);
            } else {
              alert("连接错误，请稍候再试");
            }
          },
          error: function (jqXHR) {
            alert("连接错误，请稍候再试，错误信息:" + jqXHR.responseText);
          }
        });
      e.preventDefault(); //stop default actions
      $(this).unbind(); // unbind event handlers
    });
  }

$(document).ready(function() {
  $('#spell-submit').click(function(evt) {
    submitSpellForm();
  });
});
