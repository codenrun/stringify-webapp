(function(){
	
	var controllerProvider = null;
	
	var app = angular.module('MusicStation' , [ ], function($controllerProvider) {
		controllerProvider = $controllerProvider;
	 });  



	app.run( function($rootScope, $sce, $timeout){
		
		$rootScope.viewType = 'loading';
		$rootScope.playController = null;
				
		$rootScope.showNotification = function(message){
			$rootScope.showMessage = true;
			$rootScope.message = message;
			
			if($rootScope.messageTimer){
				$timeout.cancel($rootScope.messageTimer);
				$rootScope.messageTimer = null;
			}
			
			$rootScope.messageTimer = $timeout(
			   function(){
				try { 
					$rootScope.showMessage = false;
					$rootScope.message = "";
					$rootScope.messageTimer = null;
				} 
				catch(err){
				}
			   },
			   2000
			);
		}
		
		
		$rootScope.setViewType = function(viewType){ 
			$rootScope.viewType = viewType; 
			$rootScope.playController.setView(viewType);
			try { 
				$rootScope.refresh();
			} 
			catch(err){
			}
		}; 
		
		$rootScope.refresh = function(){ 
			$timeout(
			   function(){
				try { 
					$rootScope.AddLog("Refresh UI ");
				} 
				catch(err){
				}
			   },
			   50
			);
		}; 
		
		$rootScope.flushLogs = function(){ 
			$timeout(
			   function(){
				try { 
					$rootScope.AddLog("-------------");
				} 
				catch(err){
				}
			   },
			   50
			);
		};
		
		$rootScope.AddLog = function( log ){
			try{console.log(log);}catch(err){};
				
			$rootScope.logDataHTML = $rootScope.logDataHTML || "";			
			var logHTML = $rootScope.logDataHTML + "<p>"+ log + "</p>" ;
			$rootScope.logDataHTML = $sce.trustAsHtml( logHTML);
			$rootScope.logCount = $rootScope.logCount || 0;
			$rootScope.logCount= $rootScope.logCount + 1;
		}
		
		$rootScope.showlogs= function(){ $rootScope.bShowLogs = true;}
		$rootScope.hidelogs= function(){ $rootScope.bShowLogs = false;}
		$rootScope.clearlogs= function(){ $rootScope.logDataHTML = "";$rootScope.logCount=0;}
		
	}); 
	
	
	app.controller('TabController',[ "$http",  "$q", '$sce',  "$rootScope", "$timeout", function($http,  $q ,$sce , $rootScope, $timeout ){
		
		this.tabs = [  { name :"All Songs", cat:"all" , view:"all" } ,  { name :"Artists", cat:"artists" , view:"artists" } , { name :"Albums", cat:"albums", view:"albums"  }];
		this.selectedTab = this.tabs[0];
		this.chooseTab = function( tab ){
			this.selectedTab = tab;
			$rootScope.setViewType(this.selectedTab.view);
		}
	}]); 


	app.controller('PlayController',[ "$http",  "$q", '$sce',  "$rootScope", "$timeout", function($http,  $q ,$sce , $rootScope, $timeout ){

		this.setView = function( type ){
			if( type == "all"){
				$rootScope.playController.songlist = $rootScope.playController.allSonglist;
			}	
			if( type == "albums"){
				$rootScope.playController.selectAlbum($rootScope.playController.albumlist[0]);
			}
			if( type == "artists"){
				$rootScope.playController.selectArtist($rootScope.playController.artistlist[0]);
			}
		}

		this.selectArtist = function(artist){
			this.selectedArtist= artist;
			$rootScope.playController.songlist = this.selectedArtist.songs;
		}
		
		this.selectAlbum= function(album){
			this.selectedAlbum= album;
			$rootScope.playController.songlist = this.selectedAlbum.songs;
		}
		
		this.getSavedPlayList = function(){
			return localStorage.playlist ? angular.fromJson(localStorage.playlist) : [] ;
		}
		
		
		this.savePlaylist = function(){
			 localStorage.playlist = angular.toJson(this.playlist);
		}
		
		this.audioPlayer = document.getElementById("player");
		this.audioPlayer.volume=0.45;
		
		this.audioPlayer.addEventListener("ended", function() {  
				console.log("ended:will play next song"); 
				$rootScope.playController.playNextSongInPlaylist();	
				$rootScope.$apply();
			}, 
			true
		);

		this.playNextSongInPlaylist = function(){
			
			var index = this.playlist.indexOf(this.selectedSong);
			if( index <0){
				this.selectedSong = {};
				return;
			}
			
			index = index+1;
			index = index%this.playlist.length;
			this.startPlay(index);
			
		}	
		
		
		this.addArtistSongToPlaylist = function(artist){
			
			for( var i = 0 ; i  < artist.songs.length; i++){
				this.addSongToPlaylist(artist.songs[i]);	
			}
			
			this.startPlay(0);
		
		}
		
		this.addAlbumSongToPlaylist = function(album){
			for( var i = 0 ; i  < album.songs.length; i++){
				this.addSongToPlaylist(album.songs[i]);	
			}
			
			this.startPlay(0);
		
		}
		
		
		this.playAllSongs= function(){
			for( var i = 0 ; i  < this.songlist.length; i++){
				this.addSongToPlaylist(this.songlist[i]);	
			}
			
			this.startPlay(0);

		}
		this.clearPlaylist= function(){
			this.playlist = [] ;
			this.savePlaylist();

			this.stopAndResetPlayer();
		}
		
			
		this.addSongToPlaylist = function( song){
			var index = this.playlist.indexOf(song);
			if (index == -1) {
				this.playlist.push(song);
			}
			
			if( this.playlist.length == 1){
				this.startPlay(0);	
			}
			
			this.savePlaylist();
		}
		
		this.startPlay = function(index){
			this.selectedSong= this.playlist[index];
			this.audioPlayer.load();
			
		}
		
		this.stopAndResetPlayer = function(){
			this.selectedSong= this.noSong;
			this.audioPlayer.src = this.selectedSong.path;
			
			this.audioPlayer.load();
		}
		
		this.removeSongFromPlaylist = function( song){
			
			if(this.selectedSong == song){
				if(this.playlist.length > 1 ){
					this.playNextSongInPlaylist();
				}
				else{
					this.stopAndResetPlayer();
				}
			}
			
			var index = this.playlist.indexOf(song);
			if (index > -1) {
			    this.playlist.splice(index, 1);
			}
			
			this.savePlaylist();
		}
		
		this.load = function(){
			$http.get(  "/take3/songlist.json")
				.success(
					function(jsonData) {
						
						console.log(jsonData);

						$rootScope.playController.allSonglist = [];	
					
						try{
							var songArray = jsonData.songs;
							if (songArray instanceof Array) {
								$rootScope.playController.allSonglist = songArray;
							}else{
								$rootScope.playController.allSonglist.push(songArray);
							}		
							$rootScope.AddLog( "allSonglist :" + $rootScope.playController.allSonglist.length + " songs found" );
						}					
						catch(err){
							$rootScope.AddLog("Error : " + err.message);
							
						}
						$rootScope.setViewType("all");		
					}
				);
					
					
					
			$http.get(  "/take3/albumlist.json")
				.success(
					function(jsonData) {
						
						console.log(jsonData);
						
						$rootScope.playController.albumlist = [];	
					
						try{
							var albumArray = jsonData;
							if (albumArray instanceof Array) {
								$rootScope.playController.albumlist = albumArray;
							}else{
								$rootScope.playController.albumlist.push(albumArray);
							}		
							$rootScope.AddLog( "albumlist :" + $rootScope.playController.albumlist.length + " albums found" );
						}					
						catch(err){
							$rootScope.AddLog("Error : " + err.message);
							
						}
					}
				);



			$http.get(  "/take3/artistlist.json")
				.success(
					function(jsonData)  {
						
						console.log(jsonData);
						
						$rootScope.playController.artistlist = [];	
					
						try{
							var artistArray = jsonData;
							if (artistArray instanceof Array) {
								$rootScope.playController.artistlist = artistArray;
							}else{
								$rootScope.playController.artistlist.push(artistArray);
							}		
							$rootScope.AddLog( "artistlist :" + $rootScope.playController.artistlist.length + " artists found" );
						}					
						catch(err){
							$rootScope.AddLog("Error : " + err.message);
							
						}
					}
				);
		}	
		
		
		$rootScope.playController = this;
		this.songlist = [];
		
		
		this.allSonglist = [];
		this.albumlist = [];
		this.artistlist = [];
		
		this.selectedArtist = {};
		this.selectedAlbum = {};
		
		
		this.noSong = { title : "Scroll Down and Select a Song!" , hover:0, path:""};			
		
		this.selectedSong= this.noSong;
		

		
		
		
		
		$rootScope.setViewType("loading");
		
		this.load();
		
		this.playlist = this.getSavedPlayList();
		if( this.playlist.length > 0){
			this.startPlay(0);
		}
		
		
		
	}]); 
	

	

	
	
	app.directive("backImg", function($compile, $rootScope ) {
		return function(scope, element, attrs){
			scope.$watch(
			  function(scope) {
			     // watch the 'compile' expression for changes
			    return scope.$eval(attrs.backImg);
			  },
			  function(value) {
						element.css({
					'background-image': 'url("' + value +'")',
					'background-size' : 'cover'
					});             
			  }
			);
	      };
	});

	
	app.directive("compile", function($compile, $rootScope ) {
		  return function(scope, element, attrs){
			scope.$watch(
			  function(scope) {
			     // watch the 'compile' expression for changes
			    return scope.$eval(attrs.compile);
			  },
			  function(value) {
			    element.html(value);
			    $compile(element.contents())($rootScope);
			  }
			);
	      };
	});
	
})();
