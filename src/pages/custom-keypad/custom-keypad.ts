import { Component } from '@angular/core';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomKeypadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-custom-keypad',
  templateUrl: 'custom-keypad.html',
})
export class CustomKeypadPage {
  step = 2;
  num: any;
  arr = [

  ];
  form:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events:Events,
    public viewCtrl: ViewController,) {
      this.form=this.navParams.get("form");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomKeypadPage');
  }

  pressa(i){
    console.log(i);
    if(i=='١١'){
      this.viewCtrl.dismiss();      
    }
    else if(i=='١٢'){
      this.arr.pop();

    } else if (i == "#" || i == '*') {
      
    }
    else {
      this.arr.push(i);

      
    }
    this.events.publish('keypad_',this.arr)
    this.num = this.arr.join('');
    // this.form.price=this.num;
    console.log(this.num);
  }

  back() {
    this.viewCtrl.dismiss();
  }

}
