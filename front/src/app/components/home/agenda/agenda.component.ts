import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  public calendar:Calendar;

  constructor() {
    this.calendar = new Calendar(null,null);
   }

  ngOnInit() {
  }

}


class Calendar {     
  /**
   * Constructor
   */
  constructor(year, month) {
    let today = new Date();
    if(year  == null){
      year = today.getFullYear(); 
    }          
    if(month == null){
      month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    } 
    this.currentYear=year;
    this.currentMonth=month;
    this.daysInMonth = this._daysInMonth();
  }
   
  /********************* PROPERTY ********************/  
  public dayLabels = Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");
  public currentYear=0;
  public currentMonth=0;
  private daysInMonth=0;
   
  /********************* PUBLIC **********************/  

  /**
  * return an array of days in specific <month,year>
  */
  public getDays(){
    let result = new Array();
    let weeksInMonth = this._weeksInMonth();
    let cellNumber = 0;
    let currentDay = 0;
    let table = null;
    for(let i=0; i< weeksInMonth; ++i){
      //Create days in a week
      for(let j=0;j<=7;++j){
        cellNumber =  i*7 + j;
        
        let firstDayOfTheWeek = (new Date(this.currentYear, this.currentMonth-1, 1).getUTCDay());        
        if(currentDay==0){
            //let firstDayOfTheWeek = new Date(this.currentYear, this.currentMonth, 0).getUTCDay();        
            if(cellNumber == firstDayOfTheWeek){
                currentDay=1;
            }
        }
        
        if( (currentDay!=0)&&(currentDay<= this.daysInMonth) ){
            table = [currentDay, "cell-" + this.currentYear + "-" + this.currentMonth + "-" + currentDay];
            currentDay++;  
        }else{
            table = ["", "cell-" + cellNumber];
        }

        result.push(table);
      }
    }
    return result;
}

  /**
  * return the link to the next month
  */
  public getPreviousLink() {
    let preMonth = this.currentMonth==1?12:this.currentMonth-1; 
    let preYear = this.currentMonth==1?this.currentYear-1:this.currentYear;
    return "/planning/" + preYear.toString() + "/" + preMonth.toString().padStart(2, '0');
  }

  /**
  * return the month/year
  */
  public getCurrent() {
    return this.currentMonth.toString() + "/" + this.currentYear.toString();
  }

  /**
  * return the link to the next month
  */
  public getNextLink() {
    let nextMonth = this.currentMonth==12?1:this.currentMonth+1;
    let nextYear = this.currentMonth==12?this.currentYear+1:this.currentYear;
    return "/planning/" + nextYear.toString() + "/" + nextMonth.toString().padStart(2, '0');
  }

  /********************* PRIVATE **********************/  
   
  /**
  * calculate number of weeks in a particular month
  */
  private _weeksInMonth(){ 
      // find number of days in this month
      let daysInMonths = this.daysInMonth; 
      let numOfweeks = (daysInMonths%7==0?0:1) + (daysInMonths/7);
      let monthEndingDay= new Date(this.currentYear,this.currentMonth, daysInMonths-1).getUTCDay();
      let monthStartDay = new Date(this.currentYear,this.currentMonth, 0).getUTCDay();
       
      if(monthEndingDay < monthStartDay){  
        numOfweeks++;
      }
       
      return parseInt(numOfweeks.toString());
  }

  /**
  * calculate number of days in a particular month
  */
 private _daysInMonth(){     
      return new Date(this.currentYear,this.currentMonth, 0).getDate();
  }
   
}