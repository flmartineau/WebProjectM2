import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let agenda: HTMLElement = document.getElementById('agenda')!;
    let calendar = new Calendar();
    agenda.innerHTML = calendar.show(null, null);
  }

}


class Calendar {     
  /**
   * Constructor
   */
  constructor() {
  }
   
  /********************* PROPERTY ********************/  
  private dayLabels = Array("Lun","Mar","Mer","Jeu","Ven","Sam","Dim");
   
  private currentYear=0;
   
  private currentMonth=0;
   
  private currentDay=0;
   
  private currentDate=null;
   
  private daysInMonth=0;
   
  /********************* PUBLIC **********************/  
      
  /**
  * print out the calendar
  */
  public show(year, month) {
      let today = new Date();
      if(year  == null){
        year = today.getFullYear(); 
      }          
      if(month == null){
        month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      }                  
       
      this.currentYear=year;
       
      this.currentMonth=month;
       
      this.daysInMonth=this._daysInMonth(month,year);  
       
      let content="<div id=\"calendar\">".concat(
                      "<div class=\"box bg-dark\">",
                      this._createNavi(),
                      "</div>",
                      "<div class=\"box-content\">",
                        "<ul class=\"label\">",this._createLabels(),"</ul>",
                            "<div class=\"clear\"></div>",   
                              "<ul class=\"dates\">");   

                              // Create weeks in a month
                              let weeksInMonth = this._weeksInMonth(month,year);
                              for(let i=0; i< weeksInMonth; ++i){
                                  //Create days in a week
                                  for(let j=1;j<=7;++j){
                                    content+= this._showDay( i*7 + j);
                                  }
                              }
                               
                              content+= "</ul>";
                              content+= "<div class=\"clear\"></div>";     
                            content+= "</div>";
                          content+="</div>";
      return content;   
  }
   
  /********************* PRIVATE **********************/ 
  /**
  * create the li element for ul
  */
  private _showDay(cellNumber){
       
      if(this.currentDay==0){
           
          let firstDayOfTheWeek = parseInt(new Date(this.currentYear, this.currentMonth, 0).getUTCDay().toString());        
          if(parseInt(cellNumber) == firstDayOfTheWeek){
              this.currentDay=1;
          }
      }

      let cellContent = null;
       
      if( (this.currentDay!=0)&&(this.currentDay<= this.daysInMonth) ){
          this.currentDate = new Date(this.currentYear, this.currentMonth, this.currentDay);
          cellContent = this.currentDay;
          this.currentDay++;   
           
      }else{
          this.currentDate = null;
      }
           
      return "<li id=\"li-".concat(this.currentDate,"\" value=\"0\" class=\"", (cellNumber%7==1?' start ':(cellNumber%7==0?' end ':' ')),
              (cellContent==null?'mask':''),"\">", cellContent, "</li>");
  }
   
  /**
  * create navigation
  */
  private _createNavi(){
       
      let nextMonth = this.currentMonth==12?1:this.currentMonth+1;
       
      let nextYear = this.currentMonth==12?this.currentYear+1:this.currentYear;
       
      let preMonth = this.currentMonth==1?12:this.currentMonth-1;
       
      let preYear = this.currentMonth==1?this.currentYear-1:this.currentYear;
       
      return  "<div class=\"header\">".concat(
              "<a class=\"prev\" data-href=\"/planning/", preYear.toString() , "/", preMonth.toString().padStart(2, '0') , "\">Précédent</a>",
                  "<span class=\"title\">", this.currentMonth.toString() , "/", this.currentYear.toString() , "</span>",
              "<a class=\"next\" data-href=\"/planning/", nextYear.toString() , "/", nextMonth.toString().padStart(2, '0') , "\">Suivant</a>",
          "</div>");
  }

       
  /**
  * create calendar week labels
  */
  private _createLabels(){             
      let content='';
       
      this.dayLabels.forEach(function(item){     
        content+= "<li class=\"" + (item=='Dim'?'end title':'start title') + " title\">" + item + "</li>";
      });

      return content;
  }
   
  /**
  * calculate number of weeks in a particular month
  */
  private _weeksInMonth(month=null,year=null){
      let today = new Date();
      if(year  == null){
        year = today.getFullYear(); 
      }          
      if(month == null){
        month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      } 
       
      // find number of days in this month
      let daysInMonths = this._daysInMonth(month,year);
       
      let numOfweeks = (daysInMonths%7==0?0:1) + (daysInMonths/7);
       
      let monthEndingDay= new Date(year, month, daysInMonths-1).getUTCDay();
       
      let monthStartDay = new Date(year, month, 0).getUTCDay();
       
      if(monthEndingDay < monthStartDay){  
        numOfweeks++;
      }
       
      return parseInt(numOfweeks.toString());
  }

  /**
  * calculate number of days in a particular month
  */
  private _daysInMonth(month=null,year=null){
      let today = new Date();
      if(year  == null){
        year = today.getFullYear(); 
      }          
      if(month == null){
        month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      } 
           
      return new Date(year, month, 0).getDate();
  }
   
}