Header = {
  create: function() {

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

      this.mainMenuBtn = HTMLFlow.create({
          contents:
          "<img class='mainMenuButton' src="+imgDir+"/ic_menu_white.png>",
          click:function() {
              var visibility = (SideBarFrame.content.visibility == "hidden") ? "visible" : "hidden";
              SideBarFrame.content.setVisibility(visibility);
          }
      });

      this.logo = HTMLFlow.create({
          contents:"<img style='margin-left: -165px' src='/resources/img/logo.png'>"
      });

      this.headerBar = HLayout.create({
          width:"100%",
          height: 40,
          // overflow: "hidden",
          backgroundColor : "#0D47A1",
          members:[

              this.mainMenuBtn,
              this.logo,
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
