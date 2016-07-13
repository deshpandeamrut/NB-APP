angular.module('starter.controllers', ['ngOpenFB'])
        .filter('removeHtml', function () {
            return function (value) {
                var regex = /(<([^>]+)>)|&nbsp;| (\[&hellip;])|(#gallery.*\*\/)/ig;
                result = value.replace(regex, "");
                return result;
            };
        })
        .filter('removeHref', function () {
            return function (value) {
                var regex = /href="([^\'\"]+)/ig;
                result = value.replace(regex, "");
                return result;
            };
        })

        .controller('AppCtrl', function ($scope, ngFB, $ionicLoading, ionicMaterialInk, ngFB, $state) {
            ionicMaterialInk.displayEffect();
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});
            $scope.userid = "";
//            $ionicLoading.show({
//                template: '<ion-spinner icon="android"></ion-spinner><p>Checking if you are logged in...</p>'
//            });
//            if (window.localStorage.fbAccessToken) {
//                console.log(window.localStorage.fbAccessToken);
//                ngFB.api({
//                    path: '/me',
//                    params: {fields: 'id'}
//                }).then(
//                        function (user) {
//                            $ionicLoading.hide();
//                            $scope.user = user;
//                            $state.go("app.latest");
//                        },
//                        function (error) {
//                            console.log(error.message);
//                            $ionicLoading.hide();
//                            $state.go("app.welcome");
//                        });
//            } else {
//                $ionicLoading.hide();
//                $state.go("app.welcome");
//            }

            $scope.hideNavBar = function () {
                document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
            };

            $scope.showNavBar = function () {
                document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
            };

            $scope.noHeader = function () {
                var content = document.getElementsByTagName('ion-content');
                for (var i = 0; i < content.length; i++) {
                    if (content[i].classList.contains('has-header')) {
                        content[i].classList.toggle('has-header');
                    }
                }
            };
            $scope.setExpanded = function (bool) {
                $scope.isExpanded = bool;
            };
            $scope.setHeaderFab = function (location) {
                var hasHeaderFabLeft = false;
                var hasHeaderFabRight = false;

                switch (location) {
                    case 'left':
                        hasHeaderFabLeft = true;
                        break;
                    case 'right':
                        hasHeaderFabRight = true;
                        break;
                }
                $scope.hasHeaderFabLeft = hasHeaderFabLeft;
                $scope.hasHeaderFabRight = hasHeaderFabRight;
            };

            $scope.hasHeader = function () {
                var content = document.getElementsByTagName('ion-content');
                for (var i = 0; i < content.length; i++) {
                    if (!content[i].classList.contains('has-header')) {
                        content[i].classList.toggle('has-header');
                    }
                }

            };
            $scope.hideHeader = function () {
                $scope.hideNavBar();
                $scope.noHeader();
            };
            $scope.showHeader = function () {
                $scope.showNavBar();
                $scope.hasHeader();
            };

            $scope.clearFabs = function () {
                var fabs = document.getElementsByClassName('button-fab');
                if (fabs.length && fabs.length > 1) {
                    fabs[0].remove();
                }
            };
        })
        .controller('WelcomeCtrl', function ($scope, ngFB, $state, myService, $ionicLoading, $ionicPopup, $ionicSideMenuDelegate) {
            $ionicSideMenuDelegate.canDragContent(false);


            $ionicLoading.show({
                template: '<ion-spinner icon="android">Checking login status...s</ion-spinner>'
            });
            $scope.loginStatus = false;
            if (window.localStorage.fbAccessToken) {
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id'}
                }).then(
                        function (user) {
                            $ionicLoading.hide();
                            $scope.user = user;
                            $scope.$parent.userid = user.id;
                            $scope.loginStatus = true;
                            $state.go("app.latest");
                        },
                        function (error) {
                            $ionicLoading.hide();
                            $state.go("app.welcome");
                            $scope.fbLogin();
                        });
            } else {
                $ionicLoading.hide();
            }

            /* onclick of login with fb*/
            $scope.fbLogin = function () {
                if (!$scope.loginStatus) {
                    ngFB.login({scope: 'email,publish_actions,user_hometown,user_about_me,user_birthday,user_location'}).then(
                            function (response) {
                                if (response.status === 'connected') {
                                    ngFB.api({
                                        path: '/me',
                                        params: {fields: 'id,name,gender,birthday,email,hometown,location'}
                                    }).then(
                                            function (user) {
                                                $scope.user = user;
                                                $scope.$parent.userid = user.id;
                                                myService.addUser($scope.user).then(function (response) {
                                                });
                                                $state.go("app.latest");
                                            },
                                            function (error) {
                                                console.log(error.message);
                                                $state.go("app.welcome");
                                            });
//                                $scope.closeLogin();
                                    //add fb data to nb db here
                                    $state.go("app.latest");
                                } else {
                                    $scope.showAlert("Error!", "Facebook Login Failed");
                                }
                            });
                } else {
                    $state.go("app.latest");
                }
            };

            $scope.exitApp = function () {
                ionic.Platform.exitApp();
            }
            $scope.showAlert = function (title, msg, state) {
                $ionicPopup.alert({
                    title: title,
                    template: msg
                }).then(function () {
                    $state.go(state);
                });
            };
        })
        .controller('LatestCtrl', function ($scope, myService, $ionicLoading, ngFB) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            myService.getPosts("latest").then(function (responseData) {
                $ionicLoading.hide();
                $scope.posts = responseData.posts;
            });
        })
        .controller('TouristCtrl', function ($scope, myService, $ionicLoading) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            myService.getPosts("tourist-spots").then(function (responseData) {
                $ionicLoading.hide();
                $scope.posts = responseData.posts;
            });
        })
        .controller('PostCtrl', function ($scope, $ionicLoading, $stateParams, myService, $ionicPopup) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            myService.getPost($stateParams.id).then(function (responseData) {
                $scope.postData = responseData.post;
                $ionicLoading.hide();
            });
            $scope.showAlert = function () {
                alertPopup = $ionicPopup.alert({
                    title: 'So sweet!',
                    template: "Please Mail to <a href='mailto:nammabagalkote@gmail.com'>nammabagalkote@gmail.com</a>"
                });
            };
        })
        .controller('QuickInfoCtrl', function ($scope, $ionicLoading, myService) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            myService.getQuickInfo().then(function (responseData) {
                $scope.quickInfos = responseData;
                $ionicLoading.hide();

            });
        })
        .controller('ContactUsCtrl', function ($scope) {
        })
        .controller('ProfileCtrl', function ($scope, $state, $timeout, $ionicLoading, ionicMaterialMotion, ionicMaterialInk, ngFB) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            //    $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);

            // Set Motion
            $timeout(function () {
                ionicMaterialMotion.slideUp({
                    selector: '.slide-up'
                });
            }, 300);

            $timeout(function () {
                ionicMaterialMotion.fadeSlideInRight({
                    startVelocity: 3000
                });
            }, 700);

            // Set Ink
//            ionicMaterialInk.displayEffect();
           
            ngFB.api({
                path: '/me',
                params: {fields: 'id,name,gender,birthday,email,cover,bio,hometown,location'}
            }).then(
                    function (user) {
                        $scope.user = user;
                        $scope.user.prof = "http://graph.facebook.com/" + $scope.user.id + "/picture?width=200&height=200";
                        $ionicLoading.hide();
                    },
                    function (error) {
                        console.log(error.message);
                        $state.go("app.welcome");
                    });
        })
        .controller('GalleryCtrl', function ($scope, $ionicBackdrop, $ionicLoading, ngFB, $ionicModal, $state) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            ngFB.api({
                path: '/135415729930485/photos/uploaded',
                params: {fields: 'name,id'}
            }).then(
                    function (photos) {
                        $scope.photos = photos.data;
                        $ionicLoading.hide();
                    },
                    function (error) {
                        $state.go("app.welcome");
                    });

            /* Iamge pop up code */
            $scope.showImages = function (index) {
                $scope.activeSlide = index;
                $scope.showModal('templates/imageZoomBox.html');
            };

            $scope.showModal = function (templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };

            // Close the modal
            $scope.closeModal = function () {
                $scope.modal.hide();
                $scope.modal.remove();
            };

        })
        .controller('PhotostreamCtrl', function ($scope, $ionicPlatform, $ionicActionSheet, $ionicLoading, $timeout, $ionicPopup,
                ngFB, $state) {

            /*
             var url = "http://nammabagalkot.in/Angular/YEAH.jpg";
             
             ngFB.api({
             method: 'POST',
             path: '/353580428121846/photos/uploaded',
             params: {"url": url,
             'caption':'test'
             }
             
             }).then(
             function (response) {
             //                        $scope.user = user;
             //                        $scope.user.prof = "http://graph.facebook.com/" + $scope.user.id + "/picture?width=200&height=200";
             console.log(response);
             //                        $ionicLoading.hide();
             $ionicLoading.hide();
             $scope.showAlert(JSON.stringify(response));
             },
             function (error) {
             console.log(error.message);
             //                        $state.go("app.welcome");
             $ionicLoading.hide();
             $scope.showAlert(JSON.stringify(e));
             });
             
             
             */

            $scope.showImage = false;
            $scope.inputdata = {
                caption: ''
            };

            $scope.showActionSheet = function () {
                $scope.showImage = false;
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="ion-images calm"> Gallery'},
                        {text: '<i class="ion-camera calm"> Camera'}
                    ],
// destructiveText: 'Delete',
                    titleText: 'Select a source',
                    cancelText: 'Cancel',
                    cancel: function () {
// add cancel code..
                    },
                    buttonClicked: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: index, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
                            encodingType: 0     // 0=JPG 1=PNG
                        }
                        navigator.camera.getPicture(function (FILE_URI) {
//                            console.log(FILE_URI);
                            $scope.imageUri = FILE_URI;
                            $scope.showImage = true;
                            $scope.$apply();
                            hideSheet();
                        }, onFail, options);
                        var onFail = function (e) {
                            console.log("On fail " + e);
                        };
//                        $scope.showImage = true;
//                        hideSheet();
                    }

                });

// For example's sake, hide the sheet after two seconds
                $timeout(function () {
                    hideSheet();
                }, 20000);

            };
            $scope.uploadImage = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="android"></ion-spinner>'
                });
                var fileURL = $scope.imageUri;
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                var params = {};
                params.userid = $scope.$parent.userid;
                params.caption = $scope.inputdata.caption;
                options.params = params;
                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI("http://nammabagalkot.in/nbapp/processImageUpload.php"), onUploadSuccess, function (error)
                {
                    console.log("Err:" + error);
                }, options);

            };
            var onUploadSuccess = function (e) {
                $ionicLoading.hide();
                $scope.showImage = false;
                $scope.showAlert("Thank you", "Photo posted Successfully!", "app.photosharefeed");
//                var url = "http://nammabagalkot.in/nbapp/" + e.response.trim();
//                ngFB.api({
//                    method: 'POST',
//                    path: '/135415729930485/photos/uploaded',
//                    params: {"url": url,
//                        'caption': $scope.inputdata.caption
//                    }
//
//                }).then(
//                        function (response) {
//                            console.log(response);
//                            $ionicLoading.hide();
//                            $scope.showImage = false;
//                            $scope.showAlert("Thank you", "Photo posted Successfully!", "app.photoshare");
//                        },
//                        function (error) {
//                            $ionicLoading.hide();
//                            $scope.showImage = false;
//                            $scope.showAlert("Uh! oh!", "Something went wrong, please try again.", "app.photoshare");
//                        });
            };
            var onUploadFail = function (e) {
                $ionicLoading.hide();
                $scope.showImage = false;
                $scope.showAlert("Uh! oh!", "Something went wrong, please try again.", "app.photoshare");
            };
            $scope.showAlert = function (title, msg, state) {
                $ionicPopup.alert({
                    title: title,
                    template: msg
                }).then(function () {
                    $state.go(state);
                });
            };



            /* hardware back button handling*/
//            $ionicPlatform.onHardwareBackButton(function (event) {
//                $scope.showImage = false;
//            });

        })
        .controller('PhotosharefeedCtrl', function ($scope, myService,$ionicLoading) {
            $ionicLoading.show({
                    template: '<ion-spinner icon="android"></ion-spinner>'
                });
                $scope.$on('$ionicView.enter', function(e) {
                    myService.getImages(0).then(function (responseImages) {
                $scope.photos = responseImages;
                $ionicLoading.hide();
            });
            $scope.page = {
                'showMore': true
            };
            $scope.pagenumber = 0;
            
            });
            
            $scope.loadMore = function () {
                $scope.pagenumber = $scope.pagenumber + 10;
                myService.getImages($scope.pagenumber).then(function (responseImages) {
                    if (responseImages.legth) {
                        Array.prototype.push.apply($scope.photos, responseImages);
                    } else {
                        $scope.page.showMore = false;
                    }
                });
            };
            $scope.doRefresh = function () {
                myService.getImages(0).then(function (responseImages) {
                    $scope.photos = responseImages;
                }).finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.page = {
                        'showMore': true
                    };
                    $scope.pagenumber = 0;
                    $scope.$broadcast('scroll.refreshComplete');
                });


            };
        })
        ;