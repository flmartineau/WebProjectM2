import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaEvent } from 'src/app/models/agendaEvent.model';
import { Project } from 'src/app/models/project.model';
import { AgendaService } from 'src/app/services/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  public eventId;
  public event: AgendaEvent;
  public events = [];
  public projectId;
  public project: Project;
  public calendar:Calendar;
  public year:number;
  public month:number;
  public today:string;

  constructor(private route: ActivatedRoute, public agendaService: AgendaService, public modalService: NgbModal) { }
  @ViewChild('popupUpdateAgendaEvent', {static: false}) popupUpdateAgendaEvent;

  model = {
    name: '',
    description: '',
    date: null,
  };

  ngOnInit() {
    let today = new Date();
    let year = today.getFullYear(); 
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    
    this.today = year + "-" + month + "-" + today.getUTCDate().toString().padStart(2, '0');

    this.calendar = new Calendar(year,month);

    this.route.params.subscribe(params => {
      const idProject = 'id';
      this.projectId = params[idProject];
      const idEvent = 'eventId';
      this.eventId = params[idEvent];
    });
  }

  prevMonth() {
    let prev = this.calendar.getPreviousYearMonth();
    this.calendar = new Calendar(prev[0], prev[1]);
  }

  nextMonth() {
    let next = this.calendar.getNextYearMonth();
    this.calendar = new Calendar(next[0], next[1]);
  }

  /**
   * Get the selected event info.
   */
  getEvent() {
    this.agendaService.getEventById(this.projectId, this.eventId)
        .subscribe(data => {
          this.event = data;
          console.log(data);
          this.model.name = this.event.name;
          this.model.description = this.event.description;
          this.model.date = this.event.date;
        });
  }

  /**
   * Get all the events info.
   */
  getEvents() {
    this.agendaService.getEvents(this.projectId).subscribe(data => this.events = data);
  }

  openModal() {
    this.modalService.open(this.popupUpdateAgendaEvent, { centered: true });
  }
  
  onAddSubmit(form: NgForm) {
    console.log(form);
    this.agendaService.addEvent(this.projectId, form.value).subscribe(
      res => {
        this.getEvent();
      },
      err => {
        console.log(err);
      }
    );
  }

  onUpdateSubmit(form: NgForm) {
    console.log(form.value);
    this.agendaService.updateEvent(this.projectId, this.eventId,form.value).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

}

class Calendar {     
  /**
   * Constructor
   */
  constructor(year, month) {
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
          table = [currentDay, this.currentYear + "-" + this.currentMonth + "-" + currentDay.toString().padStart(2, '0')];
          currentDay++;  
        }else{
          table = ["", cellNumber];
          //If we start a new line of cells but the first cell is empty we quit
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