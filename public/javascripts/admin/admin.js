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

var Admin = {

	initAdminScripts: function() {
		Admin.setDatatables();
		Admin.videoApproval();
		Admin.editUserVideo();
		Admin.setupDiscountForm();
		Admin.setQuestionActiveToggle();
	},

	setQuestionActiveToggle: function() {
	 	var toggleLinks = $(".question_toggle");

	 	toggleLinks.off('click');

	 	toggleLinks.on('click', function(e) {
	 		e.preventDefault();
	 		var currentState,
	 				toggleLink = $(this);

	 		$.ajax({
	 			url: toggleLink.attr('href'),
	 			success: function(response) {
	 				Admin.questionToggleState(toggleLink);
	 			}
	 		});

	 	});
	}, 

	questionToggleState: function(toggleLink, currentState) {
		var parentRow = toggleLink.parents('tr').first(),
				activeCell = parentRow.find('td.view_state');
		
		if (toggleLink.hasClass('active')) {
			toggleLink.text("Enable");
			activeCell.text("inactive");
			toggleLink.removeClass('active').addClass('inactive');
			parentRow.removeClass('active').addClass('inactive');
		} else {
			toggleLink.text("Disable");
			activeCell.text("active");
			toggleLink.removeClass('inactive').addClass('active');
			parentRow.removeClass('inactive').addClass('active');		
		}
	},

	videoApproval: function() {
		var approvalLinks = $(".approval_link");

		approvalLinks.on("click", function(e) {
			e.preventDefault();
			var self = $(this),
					param = self.text(),
					url = self.attr("href");

			$.ajax({
				url: url,
				type: "PUT",
				data: {"approval_type": param},
				success: function(response) {
					if(param === "approve") {
						self.text("unapprove");
					} else {
						self.text("approve")
					}
				},
				error: function(response, text, message) {
					var errorMessage = text + " - " + message;
        	Modal.loadModal(errorMessage);
				}

			});

		});
	},

	editUserVideo: function() {
		var editLink = $(".edit_user_video");

		editLink.on("click", function(e) {
			e.preventDefault();
			var url = $(this).attr("href");

			$.ajax({
				url: url,
				success: function(response) {
					Modal.loadModal(response);
				},
				error: function(response, text, message) {
					alert(text + " " + message);
				}
			});

		});
	},

	setupDiscountForm: function() {
		var trigger = $("#form_toggle");
				
		trigger.click(function(e) {
			e.preventDefault();
			var formBlock = $("#new_codes");
			
			formBlock.slideToggle();
			
		});
	},

	setDatatables: function() {
    var tables = $("table"),
    		potentials = $("#potential");

    potentials.dataTable({
      "bJQueryUI": true,
      "bDeferRender": true,
      "sPaginationType": "full_numbers",
      "aaSorting": [[ "Priority", "desc" ]]
    });

    

    tables.dataTable({
      "fnDrawCallback": function () {
        Admin.videoApproval();
        Admin.setQuestionActiveToggle();
      },
      "bJQueryUI": true,
      "bDeferRender": true,
      "sPaginationType": "full_numbers"
    });
  }
};

$(document).ready(function() {
	Admin.initAdminScripts();
	Navigation.setCurrentNav();
});