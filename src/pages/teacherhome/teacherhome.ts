import { RestApiProvider } from "./../../providers/rest-api/rest-api";
import { AuthProvider } from "./../../providers/auth/auth";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { DetailsPage } from "../details/details";
import { NotificationsPage } from "../notifications/notifications";
import { IntoductionPage } from "../intoduction/intoduction";
/**
 * Generated class for the TeacherhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-teacherhome",
  templateUrl: "teacherhome.html"
})
export class TeacherhomePage {
  slides = [
    {
      image: "assets/imgs/seen/course-detail.png"
    },
    {
      image: "assets/imgs/seen/detail_image.png"
    },
    {
      image: "assets/imgs/seen/detail_image.png"
    }
  ];

  courseList: any=[];
  noDataS = false;
  interval:any;
  isDidloadcalled=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public restApi: RestApiProvider
  ) {
    this.unread_count();
  }
  ionViewWillEnter() {
    if(this.isDidloadcalled==true){
      this.getMyCourses(0);
    }
   
  }
  ionViewDidLoad(){
    this.getMyCourses(1);
    this.isDidloadcalled=true;
  }

  getMyCourses(l) {
    let data = {
      user_id: { value: this.auth.getCurrentUserId(), type: "NO" }
    };
    this.restApi.postData_loader(data, 0, "my_courses",l).then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.courseList = result.data;
      } else {
      }

      if (this.courseList.length == 0) {
        this.noDataS = true;
      } else {
        this.noDataS = false;
      }
    });
  }

  
  details(k) {
    this.navCtrl.push(DetailsPage,{CourseId:k.course_id});
  }

  noti() {
    this.navCtrl.push(NotificationsPage);
  }

  unread_count() {
    this.interval =   setInterval(() => {
          // let Data = {
          //   user_id:{"value":this.auth.getCurrentUserId(),"type":"NO"},
          // }
          let Data = {
            user_id:this.auth.getCurrentUserId(),
          }
          this.restApi.get(Data,0,'GetUnreadNotification').then((result:any) => {
              console.log('unread count--',result);
              if(result.status == 1){
                  this.auth.notification_count = result.unreadNotification;
                  if(result.is_block==1) {
                    clearInterval(this.interval);
                    setTimeout(() => {
                      this.nullupdate_deviceId();
                      this.auth.removeUserDetails();
                      this.navCtrl.setRoot(IntoductionPage);
                    },500);                   
                  }
              }  {
                                 
              }
          })
      },5000)     
    }

    nullupdate_deviceId() {
      let Data = {
    id:{"value":this.auth.getCurrentUserId(),"type":'NO'},
   device_id:{"value":'',"type":'NO'},
  }
    this.restApi.postData_withoutloder(Data,0,'UpdateDeviceId').then((result:any) => {
    console.log(result);
      if(result.status == 1){
      //   window.location.href="";
      // this.nav.push(HomePage);
      // this.auth.removeAllSessions();
      }
    })
    }
}
