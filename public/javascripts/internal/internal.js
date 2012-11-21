var LessonVideo = {
	
	playInGameVideo: function(video_url, use_expose, editPage) {
		var playerWindow = $("#in_game_player"),
				lessonDiv = $("#lesson_form");

		if (use_expose === true) {
			playerWindow.expose({
				color: '#000',
				loadSpeed: 200,
				opacity: 0.9,
				closeOnClick: false
			});
		}
	
		flowplayer("in_game_player", "/flowplayer/flowplayer-3.2.8.swf", {
			clip: {
				url: video_url
			},
			plugins: {
      	controls: {
        	url: '/flowplayer/flowplayer.controls-3.2.8.swf',
          playlist: false,
          backgroundColor: '#000', 
          height: 18,
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
		flowplayer(0).play().onFinish(function() {
			this.unload();
			playerWindow.remove();
			lessonDiv.show();
			if (editPage === true) {
				$.mask.close();
			}
		});
	}
};

var TeacherDashboard = {

	initTeacherPanels: function(initPanelType) {
		var panels = $("#teacher_panels ul li.panel"),
				panelLinks = $("#teacher_nav li a");
		TeacherDashboard.showInitialPanel(panelLinks, panels, initPanelType);
		TeacherDashboard.initPanelToggles(panelLinks, panels);
		TeacherDashboard.initTableToggles();
	},

	showInitialPanel: function(panelLinks, panels, initPanelType) {
		var startingPanel = TeacherDashboard.startingPanel(panels, initPanelType),
				startingPanelNav = TeacherDashboard.startingNav(panelLinks, initPanelType);
				
		startingPanel.show();
		TeacherDashboard.toggleNav(panelLinks, startingPanelNav)
	},

	startingPanel: function(panels, initPanelType) {
		var panel = $("#teacher_panels ul " + initPanelType);
		return panel;
	},

	startingNav: function(panelLinks, initPanelType) {
		var navLink = "";

		$.each(panelLinks, function(i,v) {
			if ($(v).data("linkid") === initPanelType) {
				navLink = $(v);
			}
		});
		return navLink;
	},

	initPanelToggles: function(panelLinks, panels) {
		panelLinks.on("click", function(e) {
			e.preventDefault();
			var panelId = $(this).attr("href"),
					panel = $(panelId);
					
			TeacherDashboard.togglePanels(panels, panel);
			TeacherDashboard.toggleNav(panelLinks, $(this));
		});
	},

	togglePanels: function(panels, panel) {
		panels.hide();
		panel.show();
	},

	toggleNav: function(panelLinks, panelLink) {
		panelLinks.removeClass("active");
		panelLink.addClass("active");
	},

	validateEmailFieldOnBlur: function() {
    var emailField = $("#teacher_email");

    emailField.on("blur", function() {
      $.ajax({
        //url: "/validate-email?email=" + $(this).val(),
        url: "/validate-addon-teacher-email",
        data: {email: $(this).val()},
        cache: false,
        success: function (response, status, xhr) {
          TeacherDashboard.emailValidationNotice(response, emailField);
        },
        error: function (response, status, xhr) {

        }
      });
    });
  },

  emailValidationNotice: function(responseValue, emailField) {
    var emailValidationNoticeField = $("#email_validator_notification_field"),
        validNotification = $("<span id='valid_icon'>Valid email</span>"),
        invalidMessage = "<span>" + responseValue + " is already in use. Please try another email address.",
        inValidNotification = $("<span id='invalid_icon'></span>");

    emailValidationNoticeField.html("");
    if (responseValue === "false") {
      //emailValidationNoticeField.append(validNotification);
    } else {
      inValidNotification.append(invalidMessage);
      emailValidationNoticeField.append(inValidNotification);
      emailField.focus();
    }
  },

  initTableToggles: function() {
  	var toggleLinks = $(".table_toggle");

  	toggleLinks.on("click", function(e) {
  		e.preventDefault();
  		TeacherDashboard.toggleTable($(this));
  	});
  },

  toggleTable: function(toggleLink){
  	var segmentWrap = toggleLink.parents(".table_section").first(),
  			toggledTable = segmentWrap.find("table");

  	toggledTable.slideToggle('slow');
  }
  
};

var GameModules = {

	initModules: function() {
		GameModules.launchHunting();
	},

	launchHunting: function() {
    var moduleLink = $("#hunting_practice"),
        playerWrapper = $("#game_window"),
        playerWindow = playerWrapper.find("#inserted_game");

    moduleLink.on("click", function(e) {
      e.preventDefault();
      var closeLink = '<a class="close_link circle_close" href="">Close</a>',
          params = {
            // base: "http://flash.kosjourney.com/"
            base: "/game/"
          },
          attributes = {};
    
      swfobject.embedSWF("http://flash.kosjourney.com/KOsHuntingTask.swf", "inserted_game", "800", "600", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
      playerWrapper.append(closeLink);
      playerWindow.slideDown();
      playerWrapper.expose({
        color: '#000',
        loadSpeed: 200,
        opacity: 0.95,
        closeOnClick: false
      });
      GameModules.closeWindow(playerWrapper, playerWindow);
    });
  },

  closeWindow: function(playerWrapper, playerWindow) {
    var closeLink = $("a.close_link");

    closeLink.live("click", function(e) {
      playerWrapper.html("");
      playerWrapper.append(playerWindow);
      $.mask.close();
      e.preventDefault();
    });
  }

};

var Overlays = {
		
	triggerWelcomeWindow: function() {
		$("#help_window").overlay({
			top: 35,
			expose: {
				color: '#000',
				loadSpeed: 200,
				opacity: 0.2
			},
			// disable this for modal dialog-type of overlays
			closeOnClick: false,
			
			load: true

			// onBeforeLoad: function() {
			// 	var wrap = this.getOverlay(),
			// 			link = this.getTrigger();
			// }
		});
	},

	triggerNewAccountWindow: function() {
		$("#new_teacher").overlay({
			top: 35,
			expose: {
				color: '#000',
				loadSpeed: 200,
				opacity: 0.2
			},
			// disable this for modal dialog-type of overlays
			closeOnClick: false,
			
			load: true

			// onBeforeLoad: function() {
			// 	var wrap = this.getOverlay(),
			// 			link = this.getTrigger();
			// }
		});
	},
		
	triggerInitialStudentNotice: function() {
		Overlays.initialStudentNotice();
	},
		
	initialStudentNotice: function() {
		$("#initial_student_notice_window").overlay({
			top: 35,
			expose: {
				color: '#000',
				loadSpeed: 200,
				opacity: 0.2
			},
			// disable this for modal dialog-type of overlays
			closeOnClick: false,
			
			load: true
		});

	}

};

var Triggers = {
	
	addStudent: function() {
		var addButton = $("#add_student"),
				closeForm = $("#close_form"),
				studentForm = $("#add_form");
				
		addButton.click(function(e) {
			e.preventDefault();
			studentForm.show();
		});
		closeForm.click(function(e) {
			e.preventDefault();
			studentForm.hide();
		});
	},
	
	editStudent: function() {
		var studentLink = $(".open_edit_student_form");
		
		studentLink.click(function(e) {
			var wrap = $(this).parents(".listed_student").first(),
					form = wrap.find(".edit_form"),
					editCloseLink = form.find(".edit_cancel_button");
					
			form.slideDown();
			Triggers.closeEditForm(editCloseLink, form);
			e.preventDefault();
		});
	},
	
	closeEditForm: function(editCloseLink, form) {
		
		editCloseLink.click(function(e) {
			form.slideUp();
			e.preventDefault();
		});
	},
	
	loadLessonPanel: function() {
		var lessonLink = $(".score_trigger");
		
		lessonLink.click(function(e) {
			
			var lessonPanel = $(this).parents(".listed_student").first().find(".test_view"),
					link = $(this).attr("href");
					
			lessonPanel.html("");
			
			lessonPanel.load("" + link + " .return_panel", function() {
				lessonPanel.show();
				Triggers.closeLessonPanel();
			});
			
			e.preventDefault();
		});
	},
	
	closeLessonPanel: function() {
		var closeLink = $(".return_panel .close");
		
		closeLink.live("click", function() {
			$(this).parent().remove();
		});
	},
	
	discountForm: function() {
		var trigger = $("#form_toggle");
				
		trigger.click(function(e) {
			e.preventDefault();
			var formBlock = $("#new_codes");
			
			formBlock.slideToggle();
			
		});
	}
};

var Test = {
	
	initTest: function() {
		Test.addDynamicNav();
		Test.scrollQuestions();
	},
	
	scrollQuestions: function() {
    var horizontal = true,
     		panels = $('#slider .panel'),
     		container = $('#slider .scroll_container'),
     		scroll = $('#slider .scroll').css('overflow', 'hidden'),
				nav = $('#slider_nav .navigation li a'),
		 		prevNav = $("#buttonBar .button.l"),
				nextNav = $("#buttonBar .button.r"),
 				scrollOptions = {
      		target: scroll,
      		items: panels,
      		navigation: nav,
      		prev: prevNav,
      		next: nextNav,
      		axis: 'xy',
      		duration: 500,
      		easing: 'swing',
					onAfter: trigger
    		};				
		
		Test.setScrollType(horizontal, panels, container);
		Test.triggerWithEnter();
		
		function trigger(data) {
			var numCount = data.getAttribute("panel_number");
			
			Test.triggerCounter(numCount);
    }
		
    $('#slider').serialScroll(scrollOptions);
    $.localScroll(scrollOptions);
  },

	triggerWithEnter: function() {
		$("form").bind("keypress", function(e) {
      	if (e.keyCode === 13) {
      		return false;
      	}
      });
	},

	setScrollType: function(horizontal, panels, container){		
		if (horizontal) {
      panels.css({ 'float' : 'left', 'position' : 'relative', 'height':'265px'});
      if (panels.length > 0) {
      	container.css('width', panels.first().outerWidth() * panels.length);
      }
    }
	},
	
	addDynamicNav: function() {
		var buttonPanel = $("#buttonBar"),
				nextButton = "<a href='#' class='button blue_button l'>Previous Question</a>",
				prevButton = "<a href='#' class='button blue_button r'>Next Question</a>";
				
			buttonPanel.prepend(prevButton);
			buttonPanel.prepend(nextButton);
	},
	
	triggerCounter: function(newCount) {
		var	counter = $("#question_counter"),
				counterNum = counter.find("#count");
				
			counterNum.html(newCount);
	},
	
	selectNav: function(el) {
		el.parents('ul:first').find('a').removeClass('selected active').end().end().addClass('active selected');
    el.parents('ul:first').find('li').removeClass('selected active').end().end().addClass('active selected');
	},

	initRetake: function(mai, form, koGame, closeButton, testWindow) {
		$.ajax({
			url: "/score-test",
			async: false,
			cache: false,
			data: form.serialize(),
			success: function(response) {
				Test.loadActionResults(mai, form, koGame, closeButton, testWindow, response);
			}
		});
	},

	loadActionResults: function(mai, form, koGame, closeButton, testWindow, response) {
		testWindow.html("");
		testWindow.html(response);
		Test.triggerResultActions(mai, form, koGame, closeButton, testWindow);
	},

	triggerResultActions: function(mai, form, koGame, closeButton, testWindow) {
		var retakeButton = $("#retake_test"),
				finalButton = $("#finalize_test"),
				lessonId = $("#lesson").data("lessonid");

		retakeButton.on("click", function(e) {
			e.preventDefault();
			Test.retakeTest(mai, lessonId, koGame, closeButton, testWindow);
		});

		finalButton.on("click", function(e) {
			e.preventDefault();
			Test.returnToGame(form, koGame, closeButton, testWindow);
		});
	},

	retakeTest: function(mai, lessonId, koGame, closeButton, testWindow) {
		Test.deletePreviousResults(mai, lessonId, koGame, closeButton, testWindow);
	},

	deletePreviousResults: function(mai, lessonId, koGame, closeButton, testWindow) {

		$.ajax({
			url: "/delete-test-results",
			async: false,
			cache: false,
			data: {"lesson_id": lessonId},
			success: function(response) {
				testWindow.html("");
				app.loadFlashTest(mai, testWindow, koGame, closeButton, false);
				$("#lesson_form").fadeIn();
				$("#in_game_player").remove();
			}
		});
	},

	returnToGame: function(form, koGame, closeButton, testWindow) {
		var completeSpan = "<span class='complete'>Lesson Complete</span>",
				formId = form.attr("test_num"),
				questions = $("#listed_lessons"),
				question = questions.find("#" + formId),
				actionDiv = question.find("ul.lesson_actions li").first();
						
		actionDiv.html("");
		actionDiv.prepend(completeSpan);
		testWindow.empty();
		koGame.css({'left':'0em'});
		closeButton.show();
	}

};

var VideoUploader = {

	videoProcessingIcon: "<div id='video_processing'><img src='images/ajax-loader.gif'/> Video is Processing...<br/>This could take several minutes. </div>"

};

var Validate = {
	
	// top: -27px;
	// left: 470px;

  videoUploader: function () {
    var videoForm = $("#new_user_video");

    videoForm.validationEngine('attach', {
      onValidationComplete: function (form, status) {
        if (status === false) {
          $.validationEngine.defaults.autoPositionUpdate = true;
        } else {
          FormFuncs.disableSubmit(videoForm);
          videoForm.submit();
        }
      }
    });
  },
	
	testQuestions: function() {
		$("#lesson_form form").validationEngine('attach', {
			isOverflown:true,
			overflownDIV: ".scroll",
			promptPosition:"centerRight"
		});
	},
	
	ajaxLoadedLessons: function(mai, koGame, closeButton, testWindow) {
		$("#lesson_form form").validationEngine('attach', {
			isOverflown:true,
			overflownDIV: ".scroll",
			scroll: false,
			promptPosition:"centerRight",
			updatePromptsPosition: true,
			onValidationComplete: function (form, status) {				
				if (status === false) {
					$.validationEngine.defaults.autoPositionUpdate = true;
				} else {
					app.submitTest(mai, form, koGame, closeButton, testWindow);
				}
			} 
		});
	}
};

var User = {
	
	getUserId: function() {
		var userId = $('#mast_bd').data("userid");

		return userId;
	},

	getUserGameState: function(testWindow) {
		var userId = User.getUserId();
		
		$.ajax({
  		url: '/user-game-state',
  		data: {"user_id": userId},
  		dataType: 'json',
  		cache: false,
  		success: function(response) {
  			UserVideos.getUserVideos(response, testWindow)
  		},
  		error: function(response, text, error) {
  			// TODO
  		}
  	});
	},

	loadResetForm: function() {
		var formHtml = '<form id="password_reset_form" action="/reset-teacher-password" method="post"><div class="field"><label for="teacher_password">Password</label><input id="teacher_password" name="teacher[password]" size="30" type="password"></div><div class="field"><label for="teacher_password_confirmation">Password confirmation</label><input id="teacher_password_confirmation" name="teacher[password_confirmation]" size="30" type="password"></div><div class="actions"><input id="reset_submit" class="button green_button" name="commit" type="submit" value="Update"></div></form>';
		Modal.loadModal(formHtml, "Reset Password");
		User.resetPassword();
	},

	resetPassword: function() {
		var resetForm = $("#password_reset_form"),
				formSubmit = resetForm.find("#reset_submit");
				
		formSubmit.on("click", function(e) {
			e.preventDefault();

			$.ajax({
				url: resetForm.attr("action"),
				data: resetForm.serialize(),
				async:false,
				cache:false,
				success: function() {
					$("#modal_wrap").remove();
					Modal.loadModal("Password has been reset.");
				},
				error: function() {
					$("#modal_wrap").remove();
					Modal.loadModal("Processing error. Try again later.");
				}
			});

		});
	}
};

var UserVideos = {
	
  getUserVideos: function(userGameState, testWindow) {
  	$.ajax({
  		url: '/in-game-user-videos',
  		data: {"game_state" : userGameState},
  		cache: false,
  		success: function(response) {
  			UserVideos.initUserVideosInGame(response, testWindow);
  		},
  		error: function(response, text, error) {
  			// TODO
  		}
  	});
  },

  initUserVideosInGame: function(response, testWindow) {
  	app.loadTestWindow(response, testWindow);
  	app.hideMainCloseLink();
  	UserVideos.initCloseVideosLink();
  	UserVideos.initVideoPlayerLinks();
  },

  initCloseVideosLink: function() {
  	var closeVideosLink = $("#close_user_video_list"),
  			game = $("#kolaunch"),
				playerWindow = $("#inserted_game");

		closeVideosLink.on("click", function() {
			playerWindow.hide();
			playerWindow.empty();
			game.css({"left":"0em"});
			app.showMainCloseLink();
		});
  },

  initVideoPlayerLinks: function() {
  	var videoLink = $(".in_modal_user_video_trigger");

  	videoLink.on("click", function() {
  		UserVideos.loadVideo($(this));
  	});
  },

  loadVideo: function(link){
  	var playerWindow = $("#in_modal_player"),
  			videoUrl = link.data("url");

  	playerWindow.addClass("set_top")
    flowplayer("in_modal_player", "/flowplayer/flowplayer-3.2.7.swf", {
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
    UserVideos.closeVideo();	
  },

  closeVideo: function() {
  	var closeVideoLink = $("#close_modal_video"),
  			closeVideoListLink = $("#close_user_video_list");

  	closeVideoListLink.hide();
  	closeVideoLink.show();

    closeVideoLink.on("click", function() {
    	var playerWindow = $("#in_modal_player");
      playerWindow.empty();
      closeVideoLink.hide();
      closeVideoListLink.show();
    });
  }
};

var app = {
	
	initGame: function(sessionId,chatOption) {
		app.deactivateLaunchLink(sessionId,chatOption);
	},

	deactivateLaunchLink: function(sessionId,chatOption) {
		var link = $('.game_launch'),
				playerWrapper = $("#game_window"),
				playerWindow = playerWrapper.find("#inserted_game"),
				kolaunchgame = playerWrapper.find("#kolaunch"),
				lessons = $("#listed_lessons"),
				koLaunchLink = $("a.kolaunch_close"),
		 		orangeButton = $('.link_block');

		playerWindow.hide();
		koLaunchLink.live("click", function(e) {
			playerWrapper.html("");
			playerWindow.html("");
			playerWindow.hide();
			playerWrapper.append(playerWindow);
			$.mask.close();
			lessons.show();
			e.preventDefault();
		});
		
		link.click(function(e) {
			var mod = $(this).attr("module"),
					existingCloseLink = $(".close_link"),
					greenButton = $(".green_button");
					
			existingCloseLink.remove();
			playerWrapper.html("");
			playerWrapper.append(kolaunchgame);
			kolaunchgame.append(koLaunchLink);
			kolaunchgame.hide();
			playerWrapper.append(playerWindow);
			orangeButton.show();
			greenButton.hide();
			lessons.hide();
			e.preventDefault();
			app.loadGame(mod, sessionId, chatOption, playerWrapper, playerWindow, orangeButton, greenButton, lessons);
		});
	},
	
	loadGame: function(mod, sessionId, chatOption, playerWrapper, playerWindow, orangeButton, greenButton, lessons) {
		var closeLink = '<a class="close_link circle_close" href="">Close</a>',
				flashvars = {
					session_id: sessionId,
					chat_disabled: chatOption
				},
				params = {
					base: "http://flash.kosjourney.com/"
					// base: "/game/"
				},
				attributes = {};
		// swfobject.embedSWF("/game/" + mod + ".swf", "inserted_game", "800", "600", "9.0.0", "expressInstall.swf", flashvars, params, attributes);	
		swfobject.embedSWF("http://flash.kosjourney.com/" + mod + ".swf", "inserted_game", "800", "600", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
		playerWrapper.append(closeLink);
		playerWindow.slideDown();
		playerWrapper.expose({
			color: '#000',
			loadSpeed: 200,
			opacity: 0.9,
			closeOnClick: false
		});
		app.closeWindow(playerWrapper, playerWindow, orangeButton, greenButton, lessons);
	},

	setMainGame: function() {
		var lessons = $("#listed_lessons");
		
		lessons.hide();
	},

	hideMainCloseLink: function() {
		var mainCloseLink = $("a.kolaunch_close");
		mainCloseLink.hide();
	},

	showMainCloseLink: function() {
		var mainCloseLink = $("a.kolaunch_close");
		mainCloseLink.show();
	},
  
  // This is the func that fires when clicking on the animal in the game.
  help: function(index) {
  	var playerWrapper = $("#game_window"),
  			koGame = playerWrapper.find("#kolaunch"),
  			testWindow = playerWrapper.find("#inserted_game");

  	koGame.css({'position':'relative', 'left':'-1000em'});
  	User.getUserGameState(testWindow);
  },

  loadTestWindow: function(content, testWindow) {
  	testWindow.html("");
  	testWindow.append(content);
  	testWindow.addClass("loaded");
		testWindow.show();
  },

  removeTestWindow: function(testWindow) {
  	testWindow.hide();
  	testWindow.removeClass("loaded");
		testWindow.html("");
  },
	
	// this is the function to turn on the test link inside the game window to check/simulate 
	// functionality that happens when the game calls the function. turn on at bottom of student/show.
	takeTestLink: function() {
		var link = $("#take_test");

		link.on("click", function(e) {
			app.take_test(1);
			e.preventDefault();
		});
	},
	
	forceTest: function(lesson) {
		var link = $("#test_link_" + lesson).attr("href");
		window.location.replace(link);
	},
	
	testReturn: function(mai) {
		var studentLesson = $("#" + mai),
				status = studentLesson.attr("status");
	},
	
	take_test: function(mai) {
		var studentLesson = $("#" + mai),
				status = studentLesson.attr("status"),
				playerWrapper = $("#game_window"),
				koGame = playerWrapper.find("#kolaunch"),
				closeButton = playerWrapper.find(".kolaunch_close"),
				testWindow = playerWrapper.find("#inserted_game"),
				transitionWindow = $("#lesson_transition_window"),
				appendedTransition = transitionWindow.clone();

				if (status === "incomplete") {

					koGame.css({'position':'relative', 'left':'-1000em'});
					// koGame.remove();
					closeButton.hide();
					app.loadTestWindow(appendedTransition, testWindow)
					appendedTransition.fadeIn(3000);
					
					appendedTransition.delegate("#continue_button", "click", function() {
						appendedTransition.fadeOut(1000, function() {
							app.removeTestWindow(testWindow);
							app.loadFlashTest(mai, testWindow, koGame, closeButton, true);
						});
					});
				} else {
					return;
				}
	},
	
	loadFlashTest: function(mai, testWindow, koGame, closeButton, playVideo){

		$.ajax({
			url: "/take-test",
			async: false,
			cache: false,
			data: {math_activity_index:mai},
			success: function(response) {
				testWindow.html(response);
				testWindow.fadeIn(1000);
				app.parseData(mai, testWindow, koGame, closeButton, playVideo);
			}
		});
	},
	
	parseData: function(mai, testWindow, koGame, closeButton, playVideo){
			var lessonBlock = testWindow.find("#lesson"),
					videoUrl = lessonBlock.attr("video_url");
		
				// show loaded test
				testWindow.fadeIn(1000);
				
				if (playVideo === true) {
					// play test video
					LessonVideo.playInGameVideo(videoUrl, true);
				}

				
				// Initialize test functions
				Test.initTest();
				
				// validate form submission
				Validate.ajaxLoadedLessons(mai, koGame, closeButton, testWindow);
	},
	
	// TODO This method needs fixed to not do a double click to submit. Look into Ketchup handling
	submitTest: function(mai, form, koGame, closeButton, testWindow) {

		form.submit(function(e) {
			e.preventDefault();
			$.ajax({
		    url: form.attr("action"),
		    data: form.serialize(),
		    dataType: 'json',
		    cache: false,
		    type: "put",
		    success: function() {
		     	Test.initRetake(mai, form, koGame, closeButton, testWindow);
		    },
		    error: function() {
		      $("#buttonBar").append("<span class='red right'>Test already taken</span>");
		      closeButton.show();
		    }
	    });
		});

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
	},
	
	jensButton: function() {
		var button = $("#jen_button"),
				accounts = $("#accounts"),
				revTag = $("#rev_tag"),
				pag = $(".pagination"),
				stats = $("#stats");
		
		button.click(function() {
			accounts.hide();
			pag.hide();
			revTag.text("Accounts Deleted! Revenue Destroyed!");
			stats.html("I Told You Not To Click The Button!!!!");
		});
	},
	
	initGameExpose: function() {
		var playerWrapper = $("#game_window");
		
		playerWrapper.expose({
			color: '#000',
			loadSpeed: 200,
			opacity: 0.9,
			closeOnClick: false
		});
	},
	
	closeWindow: function(playerWrapper, playerWindow, orangeButton, greenButton, lessons) {
		var closeLink = $("a.close_link");

		closeLink.live("click", function(e) {
			playerWrapper.html("");
			playerWindow.html("");
			playerWrapper.append(playerWindow);
			$.mask.close();
			orangeButton.hide();
			greenButton.show();
			lessons.show();
			e.preventDefault();
		});
	}
};