angular.module('behave.app.services', []).service('AuthService', function($http, $q,Ajax,URL) {
    //Just for example purposes user with id=0 will represent our logged user

    this.getLoggedUser = function(data,callback) {
        //var dfd = $q.defer();
        


            $http({
        method: 'GET',
        url: URL.api_url+'users/'+data.username+"/"+data.password
    }).then(function successCallback(response) {
        console.log(response);
        if(response.data.status=="success"){
          callback(response.data.data);
        }
        else
        {
          callback(false);
        }
    }, function errorCallback(response) {
        console.log(response);
    })
       
    };

    this.createUser = function(user,success,error){
        Ajax.request('post',"users",user,success,error);
    };
}).service('Ajax',function($http,URL){

this.request = function(method,url,data,success,error){

               $http({
        method: method,
        url: URL.api_url+url,
        data:data
    }).then(success, error); 
};

}).service('URL',function(){
    this.api_url = 'http://localhost/behave_api/public/';
})
.service('ProfileService', function($http, $q) {
    this.getUserData = function(userId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var user = _.find(database.users, function(user) {
                return user.id == userId
            });
            dfd.resolve(user);
        });
        return dfd.promise;
    };
    this.getUserFollowers = function(userId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var followers_data = _.filter(database.following, function(follow) {
                return follow.followsId == userId
            });
            //remove possible duplicates
            var followers_userId = _.uniq(_.pluck(followers_data, 'userId'));
            var followers = _.map(followers_userId, function(followerId) {
                return {
                    userId: followerId,
                    userData: _.find(database.users, function(user) {
                        return user.id == followerId
                    }),
                    follow_back: !_.isUndefined(_.find(database.following, function(user) {
                        return (user.userId === userId && user.followsId === followerId)
                    }))
                }
            });
            dfd.resolve(followers);
        });
        return dfd.promise;
    };
    this.getUserFollowing = function(userId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var following_data = _.filter(database.following, function(follow) {
                return follow.userId == userId
            });
            //remove possible duplicates
            var following_userId = _.uniq(_.pluck(following_data, 'followsId'));
            var following = _.map(following_userId, function(followingId) {
                return {
                    userId: followingId,
                    userData: _.find(database.users, function(user) {
                        return user.id == followingId
                    })
                }
            });
            dfd.resolve(following);
        });
        return dfd.promise;
    };
    this.getUserPictures = function(userId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            //get user related pictures
            var user_pictures = _.filter(database.users_pictures, function(picture) {
                return picture.userId == userId;
            });
            dfd.resolve(user_pictures);
        });
        return dfd.promise;
    };
    this.getUserPosts = function(userId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            //get user related pictures
            var user_post = _.filter(database.posts, function(post) {
                return post.userId == userId;
            });
            dfd.resolve(user_post);
        });
        return dfd.promise;
    };
}).service('FeedService', function($http, $q,Ajax,URL) {
    this.getFeed = function(user_id,success,fail) {
/*        var pageSize = 5, // set your page size, which is number of records per page
            skip = pageSize * (page - 1),
            totalPosts = 1,
            totalPages = 1,*/
            Ajax.request("get","posts?user_id="+user_id,null,success,fail);
           /* dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            totalPosts = database.posts.length;
            totalPages = totalPosts / pageSize;
            var sortedPosts = _.sortBy(database.posts, function(post) {
                return new Date(post.date);
            });
            var postsToShow = sortedPosts.slice(skip, skip + pageSize);
            //add user data to posts
            var posts = _.each(postsToShow.reverse(), function(post) {
                post.user = _.find(database.users, function(user) {
                    return user.id == post.userId;
                });
                return post;
            });
            dfd.resolve({
                posts: posts,
                totalPages: totalPages
            });
        });


        return dfd.promise;*/


    };

    this.likePost = function(data,success,fail){
        Ajax.request("post","likePost",data,success,fail);
    };   
    this.dislikePost = function(data,success,fail){
        Ajax.request("post","dislikePost",data,success,fail);
    };    
    this.addComment = function(data,success,fail){
        Ajax.request("post","addComment",data,success,fail);
    };
    this.getFeedByCategory = function(page, categoryId) {
        var pageSize = 5, // set your page size, which is number of records per page
            skip = pageSize * (page - 1),
            totalPosts = 1,
            totalPages = 1,
            dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            totalPosts = database.posts.length;
            totalPages = totalPosts / pageSize;
            var sortedPosts = _.sortBy(database.posts, function(post) {
                return new Date(post.date);
            });
            if (categoryId) {
                sortedPosts = _.filter(sortedPosts, function(post) {
                    return post.category.id == categoryId;
                });
            }
            var postsToShow = sortedPosts.slice(skip, skip + pageSize);
            //add user data to posts
            var posts = _.each(postsToShow.reverse(), function(post) {
                post.user = _.find(database.users, function(user) {
                    return user.id == post.userId;
                });
                return post;
            });
            dfd.resolve({
                posts: posts,
                totalPages: totalPages
            });
        });
        return dfd.promise;
    };
    this.getFeedByTrend = function(page, trendId) {
        var pageSize = 5, // set your page size, which is number of records per page
            skip = pageSize * (page - 1),
            totalPosts = 1,
            totalPages = 1,
            dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            totalPosts = database.posts.length;
            totalPages = totalPosts / pageSize;
            var sortedPosts = _.sortBy(database.posts, function(post) {
                return new Date(post.date);
            });
            if (trendId) {
                sortedPosts = _.filter(sortedPosts, function(post) {
                    return post.trend.id == trendId;
                });
            }
            var postsToShow = sortedPosts.slice(skip, skip + pageSize);
            //add user data to posts
            var posts = _.each(postsToShow.reverse(), function(post) {
                post.user = _.find(database.users, function(user) {
                    return user.id == post.userId;
                });
                return post;
            });
            dfd.resolve({
                posts: posts,
                totalPages: totalPages
            });
        });
        return dfd.promise;
    };
    this.getPostComments = function(post) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var comments_users = database.users;
            // Randomize comments users array
            comments_users = window.knuthShuffle(comments_users.slice(0, post.comments));
            var comments_list = [];
            // Append comment text to comments list
            comments_list = _.map(comments_users, function(user) {
                var comment = {
                    user: user,
                    text: database.comments[Math.floor(Math.random() * database.comments.length)].comment
                };
                return comment;
            });
            dfd.resolve(comments_list);
        });
        return dfd.promise;
    };
    this.getPost = function(postId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var post = _.find(database.posts, function(post) {
                return post.id == postId;
            });
            post.user = _.find(database.users, function(user) {
                return user.id == post.userId;
            });
            dfd.resolve(post);
        });
        return dfd.promise;
    };
}).service('PeopleService', function($http, $q) {
    this.getPeopleSuggestions = function() {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var people_suggestions = _.each(database.people_suggestions, function(suggestion) {
                suggestion.user = _.find(database.users, function(user) {
                    return user.id == suggestion.userId;
                });
                //get user related pictures
                var user_pictures = _.filter(database.users_pictures, function(picture) {
                    return picture.userId == suggestion.userId;
                });
                suggestion.user.pictures = _.last(user_pictures, 3);
                return suggestion;
            });
            dfd.resolve(people_suggestions);
        });
        return dfd.promise;
    };
    this.getPeopleYouMayKnow = function() {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var people_you_may_know = _.each(database.people_you_may_know, function(person) {
                person.user = _.find(database.users, function(user) {
                    return user.id == person.userId;
                });
                return person;
            });
            dfd.resolve(people_you_may_know);
        });
        return dfd.promise;
    };
}).service('TrendsService', function($http, $q) {
    this.getTrends = function() {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            dfd.resolve(database.trends);
        });
        return dfd.promise;
    };
    this.getTrend = function(trendId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var trend = _.find(database.trends, function(trend) {
                return trend.id == trendId;
            });
            dfd.resolve(trend);
        });
        return dfd.promise;
    };
}).service('CategoryService', function($http, $q) {
    this.getCategories = function() {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            dfd.resolve(database.categories);
        });
        return dfd.promise;
    };
    this.getCategory = function(categoryId) {
        var dfd = $q.defer();
        $http.get('database.json').success(function(database) {
            var category = _.find(database.categories, function(category) {
                return category.id == categoryId;
            });
            dfd.resolve(category);
        });
        return dfd.promise;
    };
}).service('GooglePlacesService', function($q) {
    this.getPlacePredictions = function(query) {
        var dfd = $q.defer();
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({
            input: query
        }, function(predictions, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                dfd.resolve([]);
            } else {
                dfd.resolve(predictions);
            }
        });
        return dfd.promise;
    }
}).factory('Comment', function() {
    return function(content, user) {
        this.user = user;
        this.comment = content;
    };
}).factory('Post', function() {
    return function() {
        this.id = 0;
        this.user = {};
        this.content = "";
        this.title = "";
        this.likes = 0;
        this.dislikes = 0;
        this.comments = [];
        this.images = [];
        this.text = "";
        this.location = "";
        this.audience = '';
    };
});