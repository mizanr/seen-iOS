import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { QuizPage } from '../quiz/quiz';

/**
 * Generated class for the MyQuizPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-quiz',
  templateUrl: 'my-quiz.html',
})
export class MyQuizPage {
lists:any = new Array();
isDidloadcalled=false;
  constructor(public navCtrl: NavController,
    public auth:AuthProvider,
    public restApi:RestApiProvider,
    public alertP:AlertProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyQuizPage');
   this.get_myquiz(1);
   this.isDidloadcalled=true;
  }

  ionViewWillEnter() {
    if(this.isDidloadcalled==true){
      this.get_myquiz(0);
    }
  }


  get_myquiz(ldr) {
    let Data = {
      student_id:{value:this.auth.getCurrentUserId(),type:"NO"},
    }
    this.restApi.postData_loader(Data,0,'get_my_quiz',ldr).then((res:any) => {
      console.log(res);
      if(res.status==1){
        this.lists=res.data;
      }
    })
  }

  openQuiz(item:any) {
    if(item.quiz_count>item.student_play_count){
      this.navCtrl.push(QuizPage,{QuizId:item.quiz_id,other_detail:item});
    } else {
      this.alertP.show('تحذير!','لقد وصلت للحد الاقصى من الاختبارات');
    }
  }

}
