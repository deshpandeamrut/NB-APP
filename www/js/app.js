// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ngStorage'])
        .run(function ($ionicPlatform, ngFB, $ionicPopup) {
            ngFB.init({appId: '143343356039401', tokenStore: window.localStorage});
            $ionicPlatform.ready(function () {
                if (window.Connection) {
                    if (navigator.connection.type == Connection.NONE) {
                        $ionicPopup.confirm({
                            title: "No Internet",
                            content: "It seems like you don't have internet connection."
                        })
                                .then(function (result) {
                                    if (!result) {
                                        ionic.Platform.exitApp();
                                    }
                                });
                    }
                }

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.overlaysWebView(true);
                    StatusBar.style(1);//Light
//                    StatusBar.style(2) //Black, transulcent
//                    StatusBar.style(3) //Black, opaque
                }

            });
        })
        .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
            $stateProvider
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.tourist', {
                        url: '/search',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/touristspots.html',
                                controller: 'TouristCtrl'
                            }
                        }
                    })

                    .state('app.browse', {
                        url: '/browse',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/browse.html'
                            }
                        }
                    })
                    .state('app.playlists', {
                        url: '/playlists',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/playlists.html',
                                controller: 'PlaylistsCtrl'
                            }
                        }
                    })

                    .state('app.welcome', {
                        url: '/welcome',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/welcome.html',
                                controller: 'WelcomeCtrl'
                            }
                        }
                    })
                    .state('app.latest', {
                        url: '/latest',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/latest.html',
                                controller: 'LatestCtrl'
                            }
                        }
                    })
                    .state('app.quickinfo', {
                        url: '/quickinfo',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/quickinfo.html',
                                controller: 'QuickInfoCtrl'
                            }
                        }
                    })
                    .state('app.contactus', {
                        url: '/contactus',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/contactus.html',
                                controller: 'ContactUsCtrl'
                            }
                        }
                    })
                    .state('app.gallery', {
                        url: '/gallery',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/gallery.html',
                                controller: 'GalleryCtrl'
                            }
                        }
                    })
                    .state('app.profile', {
                        url: '/profile',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/profile.html',
                                controller: 'ProfileCtrl'
                            }
                        }
                    })
                    .state('app.photoshare', {
                        url: '/photoshare',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/photostream.html',
                                controller: 'PhotostreamCtrl'
                            }
                        }
                    })
                    .state('app.photosharefeed', {
                        url: '/photosharefeed',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/photosharefeed.html',
                                controller: 'PhotosharefeedCtrl'
                            }
                        }
                    })
                    .state('app.post', {
                        url: "/post/:id",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/post.html",
                                controller: 'PostCtrl'

                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/welcome');
        })
        .factory('myService', function ($q, $http, ngFB, $state) {
            return {
                getPosts: function (category) {
                    var url = "http://nammabagalkot.in/category/" + category + "?json=get_recent_posts";
                    var defer = $q.defer();
                    $http.get(url).success(function (response) {
                        defer.resolve(response);
                    });
                    return defer.promise;
                },
                getPost: function (postId) {
                    var url = 'http://nammabagalkot.in/api/get_post/?post_id=' + postId;
                    var defer = $q.defer();
                    $http.get(url).success(function (response) {
                        defer.resolve(response);
                    });
                    return defer.promise;
                },
                getQuickInfo: function () {
                    var url = 'http://nammabagalkot.in/QuickInfoResponse.php';
                    var defer = $q.defer();
                    $http.get(url).success(function (response) {
//                        console.log(response);
                        defer.resolve(response);
                    });
                    return defer.promise;
                },
                addUser: function (user) {
                    var url = 'http://nammabagalkot.in/nbapp/processUser.php';
                    var defer = $q.defer();
                    $http.post(url, {'action': 'addUser', 'user': user}, {headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (resp) {
                        defer.resolve(resp);
                    }).error(function (err) {
                        console.log(err);
                        defer.reject(err);
                    });
                    return defer.promise;
                },
                getImages: function (pagenumber) {
                    var url = 'http://nammabagalkot.in/nbapp/getImages.php';
                    var defer = $q.defer();
                    $http.post(url, {'pagenumber': pagenumber}, {headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'}}).success(function (resp) {
                        defer.resolve(resp);
                    }).error(function (err) {
                        console.log(err);
                        defer.reject(err);
                    });
                    return defer.promise;
                }

            };
        });
