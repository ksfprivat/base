Header = {
  create: function() {

      this.logoImg = Img.create({
          width:158, height: 40,
          src: "/resources/img/logo.png"
      });

      this.userProfileImg = Img.create({
          width:40, height: 40,
          src: "/resources/img/user_profile.png"
      });

      this.spacer = HLayout.create({
          width:"100%", height:"40"
      });

      this.userProfile = Label.create({
          valign:"center",
          contents:"user@base.org",
          styleName:"header_text"
      });

      this.logoutBtn = HTMLFlow.create({
          width: 40, height:40,
          contents:"<a href='/logout' title='Выход'><img src='/resources/img/ic_logout.png'></a>"
      });

      this.headerBar = HLayout.create({
          width:"100%",
          height: 40,
          backgroundColor : "#0D47A1",
          members:[
              this.logoImg,
              this.spacer,
              this.userProfileImg,
              this.userProfile,
              this.logoutBtn
          ]
      });

      this.init();

      return Object.create(this);
  },

  init: function () {
      getCurrentUser(function (userName) {
          Header.userProfile.setContents(userName+"@base.org");
      });
  }
};

function getCurrentUser(callback) {
    var result;
    $.ajax({
        type: 'GET',
        url: 'getCurrentUser',
        success: function(data) {
            result = data;
            if(typeof callback === "function") callback(result);
        }
    });
}
