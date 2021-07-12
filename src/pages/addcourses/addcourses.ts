import { CustomKeypadPage } from './../custom-keypad/custom-keypad';
import { DetailsPage } from './../details/details';
import { AlertProvider } from "./../../providers/alert/alert";
import { ImageProvider } from "./../../providers/image/image";
import { AuthProvider } from "./../../providers/auth/auth";
import { RestApiProvider } from "./../../providers/rest-api/rest-api";
import { Component, NgZone, ViewChild } from "@angular/core";
import { Events, ModalController, Nav, ViewController, Content } from "ionic-angular";
import { NavController, NavParams } from "ionic-angular";
import { AddlessionPage } from "../addlession/addlession";
import { AddquizPage } from "../addquiz/addquiz";
import { DataStoreProvider } from '../../providers/data-store/data-store';

@Component({
  selector: "page-addcourses",
  templateUrl: "addcourses.html"
})
export class AddcoursesPage {
  @ViewChild(Content) content: Content;
  cateList: any;
  level: any;
  formData = {
    course_title: '',
    course_image: '',
    price: '',
    level_id: '',
    cat_id: '',
    duration: '',
    course_description: '',
    youtube_link:''
  }
  type:any;
  blob_img: any = null;
  blobimageName: any = "";
  course:any='';
  keyboardshow=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public restApi: RestApiProvider,
    public auth: AuthProvider,
    public imageP: ImageProvider,
    public events:Events,
    public dataP:DataStoreProvider,
    public zone:NgZone,
    public alertP: AlertProvider,
    public viewCtrl:ViewController
  ) {
    this.getCate();
    this.course=this.navParams.get('Course');
    console.log(this.course);

    events.subscribe('keypad_', (data) => {
      console.log(data);
      zone.run(() => {
      
        this.formData.price = data.join('');
        console.log(this.formData.price);
      })     
      // if (data.length>0) {
      //   this.formData.price = data.join('');        
      // }
    })
    
  }

  getCate() {
    this.restApi.get({}, 0, "get_category").then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.dataP.cateList=result.data;
        this.cateList = result.data;
        this.getLevel();
      } else {
      }
    });
  }

  getLevel() {
    this.restApi.get({}, 0, "get_education_level").then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.dataP.levelList=result.data;
        this.level = result.data;
        if(this.course){
          this.formData = this.course;       
        }
      } else {
      }
    });
  }

  getImage() {
    this.imageP.getImage().then((img: any) => {
      console.log();
      this.blob_img = this.imageP.imgURItoBlob(img);

      this.blobimageName = this.imageP.generateImageName("hello.jpg");
      this.formData.course_image = img;
    });
  }

  addCourse() {
    let Data = {
      teacher_id: { value: this.auth.getCurrentUserId(), type: "NO" },
      course_title: { value: this.formData.course_title, type: "COURSENAME" },
      price: { value: this.formData.price, type: "PRICE" },
      cat_id: { value: this.formData.cat_id, type: "CATEGORY" },
      level_id: { value: this.formData.level_id, type: "ELEVEL" },
      course_description: { value: this.formData.course_description, type: "DESC" },
      duration: { value: this.formData.duration, type: "DURATION" },
      course_image: { value: this.blob_img, type: "IMAGE", name: this.blobimageName }
    };
    if(this.formData.youtube_link){
      Data["youtube_link"]={ value: this.formData.youtube_link, type: "NO" }
    }

    this.restApi.postData(Data, 0, "add_course").then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.alertP.showAsync('تحذير!',result.message).then(()=>{
          // let d = {}
        this.viewCtrl.dismiss(result.data.course_id);

          // this.navCtrl.push(DetailsPage, { CourseId: result.data.course_id })
        });
      } else {
        // this.alertP.show("Alert!", result.message);
      }
    });
  }

  updateCourse() {
    let Data = {
      course_id: { value: this.course.course_id, type: "NO" },
      teacher_id: { value: this.auth.getCurrentUserId(), type: "NO" },
      course_title: { value: this.formData.course_title, type: "COURSENAME" },
      price: { value: this.formData.price, type: "PRICE" },
      cat_id: { value: this.formData.cat_id, type: "CATEGORY" },
      level_id: { value: this.formData.level_id, type: "ELEVEL" },
      course_description: { value: this.formData.course_description, type: "DESC" },
      duration: { value: this.formData.duration, type: "DURATION" },
      // course_image: { value: this.blob_img, type: "IMAGE", name: this.blobimageName }
    };
    if(this.formData.youtube_link){
      Data["youtube_link"]={ value: this.formData.youtube_link, type: "NO" }
    }
    if (this.blob_img) {
      Data["course_image"] = {
        value: this.blob_img,
        type: "IMAGE",
        name: this.blobimageName
      };
    }

    this.restApi.postData(Data, 1, "edit_course").then((result: any) => {
      console.log(result);
      if (result.status == 1) {
        this.viewCtrl.dismiss(true);
      } else {
        // this.alertP.show("Alert!", result.message);
      }
    });
  }


  quiz() {
    const modal = this.modalCtrl.create(
      AddquizPage,
      {},
      { cssClass: "moremodel", showBackdrop: true, enableBackdropDismiss: true }
    );
    modal.present();
  }

  custom_keypad(type:any) {
    this.keyboardshow=true;
    this.type=type;
    setTimeout(()=>{
        this.content.resize();
    },500)
    // this.navCtrl.push(CustomKeypadPage);
    // const model = this.modalCtrl.create(CustomKeypadPage, {form:this.formData});
    // model.present();
    // model.onDidDismiss((data) => {
    //   if (data) {
    //     console.log(data);
    //     // if(this.course)
    //   //  this.formData.price = data.join('');
    //   }
    // })
  }


  closekey(){
    this.keyboardshow=false;
    setTimeout(()=>{
      this.content.resize();
    },100)
  }


  pressa(i){
    console.log(i);
    if(i=='١١'){
      this.closekey();
     // this.viewCtrl.dismiss();      
    }
    else if(i=='١٢'){
      if(this.type=='price'){
        this.formData.price = this.formData.price.substr(0,this.formData.price.length-1);
      } else {
        this.formData.duration = this.formData.duration.substr(0,this.formData.duration.length-1);
      }

    } else if (i == "#" || i == '*') {
      
    }
    else {
      if(this.type=='price'){
        this.formData.price=this.formData.price+i;
      } else {
        this.formData.duration=this.formData.duration+i;
      }
    }

  }
}
