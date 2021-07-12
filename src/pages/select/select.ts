import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Events,
  MenuController
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { TeacherloginPage } from "../teacherlogin/teacherlogin";
import { RestApiProvider } from "../../providers/rest-api/rest-api";

@Component({
  selector: "page-select",
  templateUrl: "select.html"
})
export class SelectPage {
  isTeacher = false;
  apicalled=false;
  isEnabled=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public api:RestApiProvider,
    public menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SelectPage");
    this.check();
  }
  check(){
    this.api.get({},1,'api/enableFacebook').then((res:any)=>{
      this.apicalled=true;
      if(res.status==1){
        if(res.isFacebookEnabled==0){
            this.isTeacher=true;
            this.isEnabled=false;
        }
        else{
            this.isEnabled=true;
        }
      }
    })

  }
  login() {
    if (this.isTeacher == true) {
      this.navCtrl.setRoot(TeacherloginPage);
      // this.event.publish("dashboardselect3ed", 0);
    } else if (this.isTeacher == false) {
      this.navCtrl.setRoot(LoginPage);
      // this.event.publish("dashboardselect3ed", 1);
    }
  }

  setTeacher(val) {
    this.isTeacher = val;
    console.log(this.isTeacher);
  }

  //setTeacher(){
  // this.navCtrl.push(TeacherloginPage);
  //}
}
