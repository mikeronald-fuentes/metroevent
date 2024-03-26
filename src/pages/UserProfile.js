var UserProfile = (function() {
    var username = "";
    var userType = 0;

    var getUsername = function() {
      return username;    
    };
  
    var setUsername = function(name) {
      username = name;     
    };

    var getUserType = function(){
      return  userType;
    }

    var setUserType = function(){
      return userType;
    }
  
    return {
        setUserType: setUserType,
        getUserType: getUserType,
        getUsername: getUsername,
        setUsername: setUsername
    }
  
  })();
  
export default UserProfile;