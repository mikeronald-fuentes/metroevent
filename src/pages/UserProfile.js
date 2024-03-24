var UserProfile = (function() {
    var username = "";
  
    var getUsername = function() {
      return username;    
    };
  
    var setUsername = function(name) {
      username = name;     
    };
  
    return {
        getUsername: getUsername,
        setUsername: setUsername
    }
  
  })();
  
  export default UserProfile;