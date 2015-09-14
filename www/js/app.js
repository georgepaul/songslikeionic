// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngAnimate', 'ngCookies', 'ngStorage', 'ngCordova'])

	.run(function ($ionicPlatform) {
		'use strict';

    //window.domain = "http://localhost:3000/";
    window.domain = "http://songslike.herokuapp.com/";

		$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
		// add script to 
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})


	.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	  delete $httpProvider.defaults.headers.common['X-Requested-With'];

	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider
    


	
		.state('login', {
		  url: "/login",
		  templateUrl: "templates/login.html",
		  controller: 'LoginCtrl'
		}) 

    .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })


  .state('callback', {
      url: '/callback',
      templateUrl: 'templates/today.html',
      controller: 'TodayController'
    })


		.state('logout', {
		  url: "/logout",
		  controller: 'LogoutCtrl'
		})

		.state('signup', {
		  url: '/signup',
		  templateUrl: 'templates/signup.html',
		  controller: 'SignupCtrl'
		})

		.state('search', {
		  url: '/search',
		  templateUrl: 'templates/search.html',
		  controller: 'VideosController'
		})

    .state('today', {
      url: '/today',
      templateUrl: 'templates/today.html',
      controller: 'TodayController'
    })

    .state('playlists', {
      url: '/playlists',
      templateUrl: 'templates/playlists.html',
      controller: 'PlayListsController'
    })

    .state('playlist', {
      url: '/playlist/:playlistId',
      templateUrl: 'templates/playlist.html',
      controller: 'PlaylistController'
    })

  .state('friends', {
      url: '/friends',
      templateUrl: 'templates/friends.html',
      controller: 'FriendsController'
    })

  .state('friend', {
      url: '/friend/:friendId',
      templateUrl: 'templates/friend.html',
      controller: 'FriendController'
    })

    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsController'
    })



		.state('historique', {
		  url: '/historique',
		  templateUrl: 'templates/historique.html',
		  controller: 'VideosController'
		})

		// the pet tab has its own child nav-view and history
		.state('home_landing', {
		  url: '/home',
		  templateUrl: 'templates/login.html',
		  controller: 'VideosController'
		});

	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/today');

	})

.provider('myCSRF',[function(){
  var headerName = 'X-CSRFToken';
  var cookieName = 'csrftoken';
  var allowedMethods = ['GET'];

  this.setHeaderName = function(n) {
    headerName = n;
  }
  this.setCookieName = function(n) {
    cookieName = n;
  }
  this.setAllowedMethods = function(n) {
    allowedMethods = n;
  }
  this.$get = ['$cookies', function($cookies){
    return {
      'request': function(config) {
        if(allowedMethods.indexOf(config.method) === -1) {
          // do something on success
          config.headers[headerName] = $cookies[cookieName];
        }
        return config;
      }
    }
  }];
}]).config(function($httpProvider) {
  $httpProvider.interceptors.push('myCSRF');
})

.controller("ApplicationController", function($scope, $http, $localStorage, $location) {
  

if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
            $scope.user = result.data;
          

        }, function(error) {
                alert("There was a problem getting your profile.");
                console.log(error);
                 $location.path("/login");
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
 

})

.controller("LoginCtrl", function($scope, $cordovaOauth, $http, $localStorage, $location) {


   
 $scope.login = function() {
        $cordovaOauth.facebook("225045417506532", ["user_friends","email", "read_stream", "user_website", "user_location", "user_relationships"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $localStorage.me = result.data
            saveToDB();

        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            $location.path("/login");
            console.log(error);
        });
    };

    $scope.saveToDB = function() {
      alert("savetoDB");
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
           
          
          $.post( window.domain + "/login", { name: $localStorage.me.name, 
                                              image_url: $localStorage.me.url,
                                              gender: $localStorage.me.gender,  
                                              location: $localStorage.me.location,
                                              access_token: $localStorage.accessToken,
                                              uid: $localStorage.me.id
                                              }).done(function( data ) 
          {
            alert("b");
                $location.path("/today");
           });

        }, function(error) {
                alert("There was a problem getting your profile.");
                console.log(error);
                 $location.path("/login");
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
       }// save to db


})



.controller('SignupCtrl', function($scope) {
})

.controller('SearchCtrl', function($scope) {
})

// Service

.service('VideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;
  

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '236',
    playerWidth: '100%',
    state: 'stopped'
  };
  var results = [
     //{id: 'MBGm4lwjiuA', title: '12 Billy Joe Morgan - Stop Them (& Dub)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
  ];
  var upcoming = [
    {id: '5LN7W3EtRMg', title: 'Igorrr - Vegetable Soup', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: '45YSGFctLws', title: 'Shout Out Louds - Illusions', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'ktoaj1IpTbw', title: 'CHVRCHES - Gun', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: '8Zh0tY2NfLs', title: 'N.E.R.D. ft. Nelly Furtado - Hot N\' Fun (Boys Noize Remix) HQ', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'zwJPcRtbzDk', title: 'Daft Punk - Human After All (SebastiAn Remix)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'sEwM6ERq0gc', title: 'HAIM - Forever (Official Music Video)', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'},
    {id: 'fTK4XTvZWmk', title: 'Housse De Racket â˜â˜€â˜ Apocalypso', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'}
  ];
  var history = [
    {id: '8eJDTcDUQxQ', title: 'SKRILLEX - RAGGA BOMB WITH RAGGA TWINS [OFFICIAL VIDEO]', description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam vitae voluptatem asperiores sapiente neque dolore, deserunt quas quo aut tenetur maxime doloremque aspernatur corporis explicabo necessitatibus iste voluptas, sequi fugiat!', thumbnail:'http://yoanmarchal.com/lab/app/groovehunter/img/ionic.png'}
  ];

  $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    //recupere un video en fonction de son ID dans l'historique
    youtube.player.cueVideoById(history[0].id);
     youtube.videoId = history[0].id;
     youtube.videoTitle = history[0].title;
  }

  function onYoutubeStateChange (event) {
    /*
    -1 – unstarted
    0 – ended
    1 – playing
    2 – paused
    3 – buffering
    5 – video cued

    */
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = 'playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'paused';
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'ended';
      service.launchPlayer(upcoming[0].id, upcoming[0].title);
      service.archiveVideo(upcoming[0].id, upcoming[0].title);
      service.deleteVideo(upcoming, upcoming[0].id);
    } else if (event.data == YT.PlayerState.unstarted) {
      youtube.state = 'unstarted';
    } else if (event.data == YT.PlayerState.BUFFERING) {
      youtube.state = 'buffering';
    } else if (event.data == YT.PlayerState.CUED) {
      youtube.state = 'cued';
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      /* variables du player */
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };
	

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.launchPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  };

	
  this.listResults = function (data) {
    results.length = 0;
    for (var i = data.items.length - 1; i >= 0; i--) {
      results.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.medium.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return results;
  };

  this.queueVideo = function (id, title,description,thumbnail,author) {
    upcoming.push({
    	id: id,
    	title: title,
		description: description,
		thumbnail: thumbnail,
		author: author
    });
    return upcoming;
  };

  this.archiveVideo = function (id, title,description,thumbnail,author) {
    history.unshift({
    	id: id,
    	title: title,
		description: description,
		thumbnail: thumbnail,
		author: author
    });
    return history;
  };

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getResults = function () {
    return results;
  };

  this.getUpcoming = function () {
    return upcoming;
  };

  this.getHistory = function () {
    return history;
  };




}])




.controller("TodayController", function ($scope, $ionicPopover, $http, $log) {

$("#moreoptions").show();
$("#todaymenu").show();
$("#plus").hide();
 
 $scope.$on('$destroy', function() {
   $("#todaymenu").hide();
   $("#moreoptions").hide();
  });

$http.get(window.domain + '/generalstream').then(function(resp) {
    console.log('Success', resp);
    $scope.items = resp.data
    $scope.user = "http://www.joomlaworks.net/images/demos/galleries/abstract/7.jpg"
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
//http://songslike.herokuapp.com/generalstream



})




 
.controller("PlayListsController", function ($scope, $http, $log, VideosService,$ionicModal) {



$("#createPlaylist").click(function(){
console.log("create a playlist")
        title = $("#title").val();
        description = $("#description").val();
$http.get( window.domain + '/createplaylist/'+title+'/'+description+'/').then(function(resp) {
    console.log('Success');
    // $scope.hideModal();
   }, function(err) {
    console.error('ERR', err);
  })
});
 




$("#plus").show();
//$("#playlistmenu").show();
$scope.$on('$destroy', function() {
 $("#plus").hide();
});


$scope.createList = function (){



   $ionicModal.fromTemplateUrl('templates/createlist.html', {
      scope: $scope,
      animation: 'animated ' + 'bounceIn',
      hideDelay:1020
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.hideModal = function(){
        $scope.modal.hide();
        // Note that $scope.$on('destroy') isn't called in new ionic builds where cache is used
        // It is important to remove the modal to avoid memory leaks
        $scope.modal.remove();
      }
    });
}




$http.get( window.domain + '/playlists').then(function(resp) {
    
    console.log('Success', resp);
    $scope.playlists = resp.data
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })


$(".playlist-btn").click(function(){
if ($("#playlists").hasClass("hide"))
    {
      $("#playlists").removeClass("hide");
      $("#friendlists").addClass("hide");
    }
});

$(".friendslist-btn").click(function(){

    if ($("#friendlists").hasClass("hide"))
    {
      $("#playlists").addClass("hide");
      $("#friendlists").removeClass("hide");
    }

});



  $scope.search = function () {

$http.get(window.domain + '/searchplaylists/' + this.query).then(function(resp) {
  
console.log(this.query)
console.log(resp.data)

 if(resp.data.length < 1)
  {
    $("#playlists").show();
    $("#searchresults").hide();
  }
  else{
    $("#playlists").hide();
    $("#searchresults").show();
     $scope.playlistresults = resp.data
  }
    
  


   
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
    }


//http://songslike.herokuapp.com/generalstream
}) 















.controller("FriendsController", function ($scope, $http, $log, VideosService) {

$http.get(window.domain + '/friendslist').then(function(resp) {
    console.log('Success', resp);
    $scope.friends = resp.data
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })

})




.controller("FriendController", function ($scope,$stateParams, $http, $log, VideosService) {

console.log($stateParams.friendId);

$http.get(window.domain + '/friend/' + $stateParams.friendId).then(function(resp) {
    console.log('Success', resp);
    $scope.friend = resp.data.friend
    $scope.friendresults = resp.data.results
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })


})

.controller("PlaylistController", function ($scope,$stateParams, $http, $log, VideosService) {

 $("#menutoggleright").show();
 $("#menutoggleright").removeClass("fa-ellipsis-v");
 $("#menutoggleright").addClass("fa-plus");
//$stateParams.playlistId
$http.get(window.domain + 'playlist/' + $stateParams.playlistId +"/").then(function(resp) {
    console.log('Success', resp);
    $scope.playlist = resp.data.playlist
  }, function(err) {
    console.error('ERR', err);
  })

 $scope.sampleVideo = function (id) {
      VideosService.launchPlayer(id,"title");
    }

$("#everyonestream").click(function(){

$("#friend").hide();
$("#me").hide();
$("#worldwide").show();

});

$("#friendstream").click(function(){

$("#me").hide();
$("#worldwide").hide();
$("#friend").show();

});
$("#mestream").click(function(){

$("#friend").hide();
$("#worldwide").hide();
$("#me").show();

});

})



.controller('VideosController', function ($scope,$http, $log, VideosService, $ionicPopover,$ionicModal) {

   $("#menutoggleright").hide();
    init();
    $http.get( window.domain + '/playlists').then(function(resp) {
        console.log('Success lists', resp);
        $scope.playlists = resp.data
        // For JSON responses, resp.data contains the result
        }, function(err) {
          console.error('ERR', err);
        // err.status will contain the status code
    })

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.upcoming = VideosService.getUpcoming();
      $scope.history = VideosService.getHistory();
      $scope.playlist = true;
    }

    $scope.launch = function (id, title, description, thumbnail, author) {
      VideosService.launchPlayer(id, title);
      VideosService.archiveVideo(id, title,description,thumbnail,author);
      VideosService.deleteVideo($scope.upcoming, id);
		
      $log.info('Launched id:' + id + ' and title:' + title);
    };
	
	
	$scope.next = function () {
		VideosService.launchPlayer($scope.upcoming[0].id, $scope.upcoming[0].title);
		VideosService.archiveVideo($scope.upcoming[0].id, $scope.upcoming[0].title);
		VideosService.deleteVideo($scope.upcoming, $scope.upcoming[0].id);
		$log.info('Launched id:' + $scope.upcoming[0].id + ' and title:' + $scope.upcoming[0].title);
    };
	
	$scope.previous = function () {
		VideosService.launchPlayer($scope.history[0].id, $scope.history[0].title);
		VideosService.queueVideo($scope.history[0].id, $scope.history[0].title);
		VideosService.deleteVideo($scope.history, $scope.history[0].id);
		$log.info('Launched id:' + $scope.upcoming[0].id + ' and title:' + $scope.upcoming[0].title);
    };
	
	

    $scope.queue = function (id, title,description,thumbnail,author) {
      VideosService.queueVideo(id, title,description,thumbnail,author);
      VideosService.deleteVideo($scope.history, id);
      $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function (list, id) {
      VideosService.deleteVideo($scope.upcoming, id);
      $log.info('delete id:' + id +'from upcomming');
    };

    $scope.deleteFromHistory = function (id) {
      VideosService.deleteVideo($scope.history, id);
      $log.info('delete id:' + id +'from history ');
    };


  $scope.search = function () {
   window.searchQuery = this.query
      if(window.searchthreshold){clearTimeout(window.searchthreshold) ;}
      if (this.query.length > 3)
        {
          window.searchthreshold = setTimeout(function(){ 
          $http.get(window.domain + '/searchyt/' + window.searchQuery).then(function(resp) {
          console.log('Success', resp);
          $scope.results = resp.data
        }, function(err) {
              console.error('ERR', err);
        })

           }, 1000);
 }

  




    }

     $scope.sampleVideo = function (id) {
      VideosService.launchPlayer(id,"title");
    }

    $scope.hideResult = function (state) {
      $scope.result = state;
    }


     $scope.searchMyPLaylists = function (state) {
        window.addToPlaylistsQuery = $("#searchaddtolistsquery").val();
        console.log("query")
        console.log(window.addToPlaylistsQuery)
      
      if(window.addtolistssearchthreshold){clearTimeout(window.addtolistssearchthreshold);}
     
      if (window.addToPlaylistsQuery.length > 3)
        {
          window.addtolistssearchthreshold = setTimeout(function(){ 
         
          $http.get(window.domain + '/searchplaylists/' + window.addToPlaylistsQuery).then(function(resp) {
          console.log('Success', resp);
          $scope.searchaddplaylists = resp.data
          $("#defaultlists").hide();
          $("#playlistsearchresults").show();
          // For JSON responses, resp.data contains the result
         }, function(err) {
          console.error('ERR', err);
        })

           }, 1000);
     }
     else{
$("#defaultlists").show();
          $("#playlistsearchresults").hide();

     }
}


    
    $scope.SearchToPlaylistModal = function(videoid){
      console.log('bounceIn');
      console.log(videoid);
      $scope.videoId = videoid;
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'animated ' + 'bounceIn',
      hideDelay:1020
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.hideModal = function(){
        $scope.modal.hide();
        // Note that $scope.$on('destroy') isn't called in new ionic builds where cache is used
        // It is important to remove the modal to avoid memory leaks
         $("#SaveTitle").text("Save To Playlist");
        $scope.modal.remove();
      }
    });
    }

 $scope.addToPlaylist = function(playlistid){
     console.log("addtoplaylist");
     console.log(playlistid);
     console.log($scope.videoId);

     $("#SaveTitle").text("Saving...");

  $http.get( window.domain + "addtoplaylist/" + $scope.videoId +"/"+ playlistid).
  then(function(response) {
     $("#SaveTitle").text("Saved");


    $scope.hideModal();
    // this callback will be called asynchronously
    // when the response is available
  }, function(response) {
   $scope.hideModal();
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });



    }

})


.controller('NavController', function($scope, $http, $log, VideosService, $ionicPopover){
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
})

