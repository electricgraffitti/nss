var Flash = {

  injectFlashBox: function() {
    $('#flash').addClass("flash_wrap");
    $("#flash").hide();
  },

  setFlash: function() {
    var flash_message = $("#flash").html();
    var msg = $.trim(flash_message);
    if (msg !== "") {
      Flash.activateNotice(flash_message);
    }
  },

  activateNotice: function(flash_message) {
    var flash_div = $("#flash");
    flash_div.html(flash_message);
    flash_div.show("slide", {
      direction: 'up'
    });
    // Set the fadeout
    setTimeout(function() {
      flash_div.hide("slide", {
        direction: 'up'
      },
      function() {
        flash_div.html("");
        flash_div.hide();
      });
    },
    2500);
  }
};

var Ajax = {
  
  ajaxIcon: "<p>Processing... <img src='/images/ajax-loader.gif'/></p>",

  ajaxFlash: function() {
  },

  ajaxStatus: function() {
    var status = $("#ajax_status");

    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      }
    });

    $("body").ajaxStart(function() {
      status.show();
    });

    $("body").ajaxStop(function() {
      status.fadeOut();
    });
  }
};

var Utility = {

  isNumeric: function(strString) {
   var validChars = "0123456789",
       strChar,
       checkResult = true;

   if (strString.length == 0) return false;

   //  test strString consists of valid characters listed above
   for (i = 0; i < strString.length && checkResult == true; i++)
      {
      strChar = strString.charAt(i);
      if (validChars.indexOf(strChar) == -1)
         {
         checkResult = false;
         }
      }
   return checkResult;
  },

  updateTotals: function(discountAmount) {
    var cartPrice = $(".plan_price"),
        cartTotal = $("#cart_totals .cart_total span"),
        totalField = $("#total_price"),
        teacherField = $("#teacher_count"),
        studentField = $("#student_count"),
        newStudentTotal = (Utility.calculateInputValue($("#students"), 12)),
        newTeacherTotal = (Utility.calculateInputValue($("#teachers"), 20)),
        newTotal = Utility.calculateTotal(newStudentTotal, newTeacherTotal, discountAmount);

      cartTotal.text("$" + newTotal + ".00");
      cartPrice.text("$" + newTotal + ".00");
      totalField.val(newTotal);
      studentField.val($("#add_more #students").val());
      teacherField.val($("#add_more #teachers").val());
  },

  calculateInputValue: function (element, multiplier) {
    var value = parseInt(element.val()) * multiplier
    if (value >= 1) {
      return value
    } else {
      return 0
    }
  },

  calculateDiscount: function (response) {
    var discountAmount = Utility.checkForDiscountValue(response);
        cartBlock = $("#cart_totals");
    Utility.updateTotals(discountAmount);
    cartBlock.data("cart-discount", discountAmount)
  },

  checkForDiscountValue: function(response) {
    var currentValue = response.discount_value;

    if (currentValue == null) {
      return currentValue = 100;
    } else {
      return parseInt(currentValue);
    }
  },

  calculateTotal: function(studentTotal, teacherTotal, discountAmount) {
    if (discountAmount > 0) {
      return Utility.calculateTotalWithDiscount(studentTotal, teacherTotal, discountAmount);
    } else {
      return studentTotal + teacherTotal;
    }
  },

  calculateTotalWithDiscount: function(studentTotal, teacherTotal, discountAmount) {
    var total = ((studentTotal + teacherTotal) - discountAmount);

    if (total < 0 ) {
      return 0;
    } else {
      return total;
    }
  }

};

var FormFuncs = {

  swapQuestionType: function() {
    
    var form = $("#new_ko_question"),
        shortAnswerView = form.find("#short_answer"),
        multipleChoiceView = form.find("#multiple_choice"),
        multipleChoiceViewFields = multipleChoiceView.find(".field"),
        choiceSelector = form.find("#ko_question_question_type");
        
    choiceSelector.change(function() {      
      if ($(this).val() === "Essay") {
        shortAnswerView.show();
        multipleChoiceView.hide();
        multipleChoiceViewFields.each(function(i,v) {
          $(this).children("input").val("");
          $(this).find("input:checkbox").removeAttr("checked");
        });
      } else {
        shortAnswerView.hide();
        multipleChoiceView.show();
      }
    }); 
        
  },

  disableSubmit: function(formElement) {
    var button = formElement.find(".actions .button");

    button.attr("disabled", "disabled");
    button.attr("value", "Processing");
    button.removeClass("purple_button");
    button.addClass("orange_button");
  },

  appendAjaxNotice: function (formElement) {
    var formSubmit = formElement.find("#user_video_submit"),
        submitWrap = formSubmit.parent();

        formSubmit.hide();
        submitWrap.append(VideoUploader.videoProcessingIcon);
  },

  checkForEmptyValue: function(formElement) {
    if (formElement.val() === "") {
      return true;
    }
  },

  validatePricingForm: function () {
    $("#pricing_form").bind('fieldIsInvalid', function(event, form, el) {
      el.focus();
    }).ketchup({
      validateEvents: 'blur keyup'
    });
  },

  pricingCalculator: function() {
    var userInputs = $(".pricing_rows input"),
        totalPrice = $("#total_price"),
        totalPriceField = $("#total_price_tag");

    userInputs.on("keyup", function () {
      var studentTotal = (Utility.calculateInputValue($("#number_of_students"), 12)),
          teacherTotal = (Utility.calculateInputValue($("#number_of_teachers"), 20)),
          newTotal = studentTotal + teacherTotal;

      totalPrice.text(newTotal);
      totalPriceField.val(newTotal);
    });
  },

  validateEnterpriseForm: function() {
    $("#enterprise_form").ketchup();
  }
};

var Video = {
  
  initVideos: function() {
    Video.triggerVideo();
  },

  triggerVideo: function() {
    var triggerLink = $(".user_video_trigger");

    triggerLink.on("click", function() {
      var url = $(this).data("url"),
          thumb = $(this).data("thumb");

      Video.playVideo(url, thumb);
    });
  },

  closeVideo: function() {
    var closeLink = $(".close_link");

    closeLink.on("click", function(e) {
      var playerWrapper = $(this).siblings("#player");

      playerWrapper.html("");
      $.mask.close();
      $(this).remove();
      e.preventDefault();
    });
  },

  playVideo: function(videoUrl,videoThumbUrl) {
    var playerWindow = $("#player"),
        playerWrap = playerWindow.parent();

    playerWrap.expose({
      color: '#000',
      loadSpeed: 200,
      opacity: 0.9,
      closeOnClick: false
    });

    playerWrap.addClass("center_wrap");
    playerWrap.removeAttr("style");
    playerWrap.append("<div id='close_link' class='close_link close'></div>");
    
    flowplayer("player", "/flowplayer/flowplayer-3.2.7.swf", {
      clip: {
        url: videoUrl,
        scaling: 'orig'
      },
      plugins: {
        controls: {
          url: '/flowplayer/flowplayer.controls-3.2.5.swf',
          playlist: false,
          backgroundColor: '#000', 
          time: false,
          fullscreen: true,
          volume: false,
          bufferColor: '#666666',
          buttonColor: '#666666',
          tooltips: {
            buttons: true, 
            fullscreen: 'Fullscreen' 
          } 
        }
      }
    });
    Video.closeVideo();
  }
};

var Modal = {

  createModal: function(insertedData, titleText){
    var modalWrap = $("<div id='modal_wrap'></div>"),
        modalTitle = $("<span id='modal_title'></span>"),
        modalHeader = $("<div id='modal_header' class='black_gradient'></div>"),
        modalCloseLink = $("<div id='close_modal_link' class='button close_button red_button'>X</div>"),
        modalContent = $("<div id='modal_content'></div>");
        
        if (titleText != undefined) {
          modalTitle.text(titleText);
          modalHeader.prepend(modalTitle);
        }
        modalContent.append(insertedData);
        modalHeader.append(modalCloseLink);
        modalWrap.append(modalHeader).append(modalContent);
        return modalWrap;
  },

  confirmDelete: function(message, callback) {
    var confirmMessage = (message ? message : "Are you sure you want to delete?"),
        confirmContent = Modal.confirmModalContent(confirmMessage),
        modal = Modal.loadModal(confirmContent);

    Modal.activateConfirm(callback);
  },

  confirmModalContent: function(message) {
    var confirmWrap = $("<div id='confirm_wrap'></div>"),
        confirmMessage = $("<div id='confirm_message'></div>"),
        confirmOkButton = $("<span id='confirm_ok' class='button green_button'>Ok</span>"),
        confirmCancelButton = $("<span id='confirm_cancel' class='button red_button'>Cancel</span>");

        confirmMessage.text(message);
        confirmWrap.append(confirmMessage).append(confirmOkButton).append(confirmCancelButton);

        return confirmWrap;
  },

  activateConfirm: function(callback) {
    var modal = $("#modal_wrap"),
        okButton = $("#confirm_ok"),
        cancelButton = $("#confirm_cancel");

    okButton.on("click", function() {
      modal.remove();
      callback();
    });
    cancelButton.on("click", function() {
      modal.remove();
      return false;
    });
  },

  loadModal: function(insertedData, titleText) {
    var modal = Modal.createModal(insertedData, titleText);
        
    Modal.removeModal();    
    $('body').append(modal);
    modal.css({"top" : ($("body").scrollTop() + 50) })
    Modal.closeModal();
    Modal.dragModal();
  },

  dragModal: function() {
    var modal = $("#modal_wrap"),
        modalHeader = modal.find("#modal_header");
      
    modal.draggable({
      handle: modalHeader
    });
  },

  closeModal: function() {
    var closeLink = $("#close_modal_link");

    closeLink.on("click", function() {
      Modal.removeModal();
    });
  },

  removeModal: function() {
    var modal = $("#modal_wrap");
    modal.remove();
  }
};

var Tabs = {
  
  initTabs: function() {
    var tabs = $(".tab");

    tabs.on("click", function() {
      var tabSet = $(this).parents(".tab_set").first(),
          tabPanels = tabSet.find(".tab_panel"),
          panelId = $(this).data("panel"),
          currentPanel = $(this).parents(".tab_set").find("#" + panelId);

          tabs.removeClass("active");
          $(this).addClass("active");
          tabPanels.removeClass("active");
          currentPanel.addClass("active");

    });   
  }
};

var App = {

  initDeleteLinks: function() {
    var deleteLinks = $(".delete_link");

    deleteLinks.on("click", function(e) {
      var self = $(this);
      
      Modal.confirmDelete("Are you sure? Deleting this record will not credit your account.", function() {
        App.deleteRecord(self);
      });
      e.preventDefault();
    });
  },

  deleteRecord: function(link) {
    var url = link.attr("href"),
        parent = link.parents(".delete_parent").first();

    $.ajax({
      url: url,
      type: "DELETE",
      success: function(response) {
        parent.remove();
        Modal.loadModal("Record deleted.");
      },
      error: function(response, text, message) {
        var errorMessage = text + " - " + message;
        Modal.loadModal(errorMessage);
      }
    }); 
  }
};

//**********Initialize Document**********//
$(document).ready(function() {
  Flash.injectFlashBox();
  Flash.setFlash();
  Video.initVideos();
  App.initDeleteLinks();
});