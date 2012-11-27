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

var Navigation = {

  setCurrentNav: function() {
    var url = location.pathname,
        all_links = $('ul.main_nav li'),
        current_link = $('ul.main_nav li a[href$="' + url + '"]'),
        active_link = current_link.parent("li");

    if (url == "/") {
      all_links.removeClass('active');
      $('.home').addClass('active');
    } else {
      all_links.removeClass('active');
      active_link.addClass('active');
    }
  }
};

var Ajax = {
  
  ajaxIcon: "<img src='/images/ajax-loader.gif'/>",

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
  }
};

var ToolTips = {

  initToolTips: function () {
    ToolTips.triggerToolTips();
  },

  toolTipSwitch: function (triggerElement) {
    var toolTipType = triggerElement.data("tooltiptype");
    ToolTips.removeToolTip();
    switch (toolTipType) {
      case 'micro':
        ToolTips.microToolTip(triggerElement, toolTipType);
        break;
      case 'info':
        ToolTips.infoToolTip(triggerElement, toolTipType);
        break;
      default:
        ToolTips.microToolTip(triggerElement, toolTipType);
        break;
    }
  },

  removeToolTip: function () {
    var toolTip = jQuery("#tool_tip_wrap");
    toolTip.remove();
  },

  microToolTip: function (triggerElement, toolTipType) {
    var toolTipContent = ToolTips.getMicroTipValue(triggerElement),
        toolTip = ToolTips.createToolTip(toolTipType, toolTipContent);

    ToolTips.drawToolTip(triggerElement, toolTip);
  },

  infoToolTip: function (triggerElement, toolTipType) {
    var toolTipContent = ToolTips.getRemoteContent(triggerElement.data('tooltipdataurl')),
        toolTipHeader = ToolTips.buildToolTipHeader(triggerElement, toolTipContent),
        toolTip = ToolTips.createToolTip(toolTipType, toolTipContent, toolTipHeader);

    ToolTips.drawToolTip(triggerElement, toolTip);
  },

  getRemoteContent: function (toolTipContentUrl) {
    var content;
    jQuery.ajax({
      url: toolTipContentUrl,
      cache: true,
      async: false,
      success: function (data) {
        content = $(data).find('.tooltip_content');
      }
    });
    return content;
  },

  getMicroTipValue: function (triggerElement) {
    if (triggerElement.data("tooltiptitle")) {
      return triggerElement.data("tooltiptitle");
    } else if (triggerElement.attr("title")) {
      return triggerElement.attr("title");
    } else {
      return triggerElement.next().text();
    }
  },

  createToolTip: function (toolTipType, content, header) {
    var toolTip = ToolTips.createToolTipWrapperHtml(),
        toolTipContent = ToolTips.createToolTipContentHtml(),
        toolTipArrow = ToolTips.createToolTipArrowHtml();

    toolTipContent.html(content);
    toolTip.append(header);
    toolTip.append(toolTipContent);
    toolTip.append(toolTipArrow);
    toolTip.addClass(toolTipType);

    return toolTip;
  },

  createToolTipWrapperHtml: function () {
    return jQuery("<div id='tool_tip_wrap' class='bottom left'></div>");
  },

  createToolTipHeaderHtml: function () {
    return jQuery("<div id='tool_tip_header'>ToolTip</div>");
  },

  createToolTipContentHtml: function () {
    return jQuery("<div id='tool_tip_content' class='tip_content'></div>");
  },

  createToolTipArrowHtml: function () {
    return jQuery("<div id='tool_tip_arrow'></div>");
  },

  calculateHeaderText: function (triggerElement, toolTipContent) {
    return triggerElement.data('tooltiptitle') ? triggerElement.data('tooltiptitle') : (toolTipContent.find('.popup_header').text() ? toolTipContent.find('.popup_header').text() : "");
  },

  infoTipPopupTriggerHtml: function (triggerElement, width, height) {
    var popupWidth = width ? width : 300,
        popupHeight = height ? height : 300,
        popuptrigger = jQuery("<a id='tool_tip_popup_trigger' class='icon small_icon popup_window_icon popup_link' popupTitle='Code Desc' href='" + triggerElement.data('tooltipdataurl') + "' popupWidth='" + popupWidth + "' popupHeight='" + popupHeight + "'></a>");

    return triggerElement.data('hastooltippopout') ? popuptrigger : "";
  },

  buildToolTipHeader: function (triggerElement, toolTipContent) {
    var headerHtml = ToolTips.createToolTipHeaderHtml(),
        toolTipPopupTrigger = ToolTips.infoTipPopupTriggerHtml(triggerElement),
        headerTextValue = ToolTips.calculateHeaderText(triggerElement, toolTipContent);

    headerHtml.text(headerTextValue);
    headerHtml.append(toolTipPopupTrigger);
    return headerHtml;
  },

  adjustForTableTip: function (tooltip) {
    var toolTipHeader = tooltip.find('#tool_tip_header');

    tooltip.removeClass('info');
    tooltip.addClass('table_tip');
    toolTipHeader.width(tooltip.find('#tool_tip_content').width());
    tooltip.width(toolTipHeader.width() + 20);
  },

  drawToolTip: function (triggerElement, tooltip) {
    var isTableTip = triggerElement.data('istabletip');
    jQuery("body").append(tooltip);
    ToolTips.positionToolTip(triggerElement, tooltip);
    if (isTableTip === true) {
      ToolTips.adjustForTableTip(tooltip);
    }
    Popup.initScripts();
  },

  positionToolTip: function (triggerElement, tooltip) {
    var position = triggerElement.offset(),
        calcHorizPosition = "",
        calcVertPosition = "",
        tipHeight = tooltip.outerHeight() + 10,
        tipWidth = tooltip.outerWidth(),
        horzPosition = position.left + tipWidth + triggerElement.outerWidth();

    tooltip.css({ "position": "absolute" });

    if (jQuery(window).width() < horzPosition) {
      calcHorizPosition = (position.left - tipWidth);
      tooltip.css({ "left": calcHorizPosition });
      tooltip.removeClass("left").addClass("right");
    } else {
      calcHorizPosition = (position.left + triggerElement.outerWidth());
      tooltip.css({ "left": calcHorizPosition });
    }

    if (position.top < tipHeight) {
      calcVertPosition = (position.top + triggerElement.outerHeight());
      tooltip.css({ "top": calcVertPosition });
      tooltip.removeClass("bottom").addClass("top");
    } else {
      calcVertPosition = (position.top - tipHeight);
      tooltip.css({ "top": calcVertPosition });
    }
  },

  triggerToolTips: function () {
    var tooltips = jQuery(".tooltip"),
        tipIsVisible = false;

    tooltips.hoverIntent({
      over: function () {
        var self = jQuery(this);
        if (tipIsVisible) { clearTimeout(tipIsVisible); }
        ToolTips.toolTipSwitch(self);
      },
      timer: 1500,
      out: function () {
        tipIsVisible = setTimeout(ToolTips.removeToolTip, 900);
        jQuery("#tool_tip_wrap").on("mouseenter", function () {
          clearTimeout(tipIsVisible);
        });
        jQuery("#tool_tip_wrap").on("mouseleave", function () {
          tipIsVisible = setTimeout(ToolTips.removeToolTip, 900);
        });
      }
    });
  }
};

var Popup = {

    initScripts: function () {
      Popup.activateLinks();
    },

    activateLinks: function (link) {
      var triggerLinks = $(".popup_link");

      triggerLinks.off("click");

      triggerLinks.on("click", function (e) {
        e.preventDefault();
        Popup.triggerPopup($(this));
      });
    },

    triggerPopup: function (link) {
      var name = link.attr("popupName"),
          title = link.attr("popupTitle"),
          url = link.attr("href"),
          popupWidth = link.attr("popupWidth"),
          popupHeight = link.attr("popupHeight");

      if (name) {
        Popup.generateReusedWindow(title, url, name, popupWidth, popupHeight);
      }
      else {
        Popup.generateWindow(title, url, popupWidth, popupHeight);
      }
    },

    generateWindow: function (title, url, width, height) {
        Popup.generatePositionedWindow(title, url, "", "", "", width, height);
    },

    generateReusedWindow: function (title, url, name, width, height) {
        Popup.generatePositionedWindow(title, url, name, "", "", width, height);
    },

    generatePositionedWindow: function (title, url, name, top, left, width, height) {
        var winOptions = "";
        if (top != "") {
            winOptions = "top=" + top + ", ";
        };
        if (left != "") {
            winOptions += "left=" + left + ", ";
        };
        name = name.replace(/ /g, "_");
        var win = window.open(url, name, winOptions + "width=" + width + ", height=" + height + ", toolbar=0, location=0, directories=0, status=0, menubar=0, copyhistory=0, resizable=1, scrollbars=0", true);
        win.focus();
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

var Layout = {

  setPanels: function() {
    Layout.setPanelSizes();
    Layout.setInternalContentPanel();
  },

  setPanelSizes: function() {
    var header = $("#hd"),
        footer = $("#footer"),
        sidebar = $("#sidebar"),
        content = $("#content");

    sidebar.height($(window).height() - (footer.outerHeight() + header.outerHeight()));
    content.height($(window).height() - (footer.outerHeight() + header.outerHeight()));

    $(window).resize(function() {
      sidebar.height($(window).height() - (footer.outerHeight() + header.outerHeight()));
      content.height($(window).height() - (footer.outerHeight() + header.outerHeight()));
    });
  },

  setInternalContentPanel: function() {
    var contentPanel = $("#content"),
        sidebar = $("#sidebar");

    contentPanel.width($(window).width() - (sidebar.outerWidth() + 1));
    $(window).resize(function() {
      contentPanel.width($(window).width() - (sidebar.outerWidth() + 1));
    });
  }
};

var App = {

  initialize: function () {
    Flash.injectFlashBox();
    Flash.setFlash();
    App.initDeleteLinks();
    Layout.setPanels();
    Navigation.setCurrentNav();
    ToolTips.initToolTips();
  },

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
  App.initialize();
});