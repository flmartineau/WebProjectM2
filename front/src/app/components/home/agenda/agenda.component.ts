import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  public calendar:Calendar;
  public year:number;
  public month:number;

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const year = 'year';
      const month = 'month';
      this.year = params[year];
      this.month = params[month];
    });
    this.calendar = new Calendar(this.year,this.month);
  }

  prevMonth() {
    let prev = this.calendar.getPreviousYearMonth();
    console.log(prev);
    this.calendar = new Calendar(prev[0], prev[1]);
  }

  nextMonth() {
    let next = this.calendar.getNextYearMonth();
    console.log(next);
    this.calendar = new Calendar(next[0], next[1]);
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
      for(let j=1;j<=7;++j){
        cellNumber =  i*7 + j;
        
        if(currentDay==0){
          let firstDayOfTheWeek = (new Date(this.currentYear, this.currentMonth-1, 1).getUTCDay()) +1; 
          if(cellNumber == firstDayOfTheWeek){
              currentDay=1;
          }
        }
        
        if( (currentDay!=0)&&(currentDay<= this.daysInMonth) ){
          table = [currentDay, this.currentYear + "-" + this.currentMonth + "-" + currentDay];
          currentDay++;  
        }else{
          table = ["", cellNumber];
          //If we start a new line of cell but the first cell is empty we quit
          if(i!=0 && j==1) break;
        }

        result.push(table);
      }
    }
    return result;
}

  /**
  * return the link to the next month
  */
  public getPreviousYearMonth() {
    let preMonth = this.currentMonth==1?12:parseInt(this.currentMonth.toString())-1; 
    let preYear = this.currentMonth==1?parseInt(this.currentYear.toString())-1:this.currentYear;
    return [preYear.toString(), preMonth.toString().padStart(2, '0')];
  }

  /**
  * return the month/year
  */
  public getCurrent() {
    return this.currentMonth.toString().padStart(2, '0') + "/" + this.currentYear.toString();
  }

  /**
  * return the link to the next month
  */
  public getNextYearMonth() {
    let nextMonth = this.currentMonth==12?1:parseInt(this.currentMonth.toString())+1;
    let nextYear = this.currentMonth==12?parseInt(this.currentYear.toString())+1:this.currentYear;
    return [nextYear.toString(), nextMonth.toString().padStart(2, '0')];
  }

  /********************* PRIVATE **********************/  
   
  /**
  * calculate number of weeks in a particular month
  */
  private _weeksInMonth(){ 
      // find number of days in this month
      let daysInMonths = this.daysInMonth; 
      let numOfweeks = (daysInMonths%7==0?0:1) + (daysInMonths/7);
      let monthEndingDay= new Date(this.currentYear,this.currentMonth-1, daysInMonths-1).getUTCDay();
      let monthStartDay = new Date(this.currentYear,this.currentMonth-1, 0).getUTCDay();
       
      if(monthEndingDay < monthStartDay){  
        numOfweeks++;
      }
       
      return Math.ceil(numOfweeks);
  }

  /**
  * calculate number of days in a particular month
  */
 private _daysInMonth(){     
      return new Date(this.currentYear,this.currentMonth, 0).getDate();
  }
   
}