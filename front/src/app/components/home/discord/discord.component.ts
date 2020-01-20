import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DiscordService } from 'src/app/services/discord.service';

@Component({
  selector: 'app-discord',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {
  @ViewChild('popupServer', {static: false}) popupServer;

  public projectId;
  public discordRef;
  public discordIframeLink1;
  public discordIframeLink2;

  public errorMessage;
  public errorStatus;

  constructor(private route: ActivatedRoute,
              public projectService: ProjectService,
              public discordService: DiscordService,
              public modalService: NgbModal,
              public sanitizer : DomSanitizer) { }

    model = {
      discordServerID: '',
      discordChannelID: ''
    };



  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = 'id';
      this.projectId = params[id];
    });
    this.getProjectDiscord();
  }

  ngAfterViewInit(){
    this.openModal();
    this.getProjectDiscord();
  }

  ngOnDestroy(){
    this.modalService.dismissAll();
  }

  /**
   * Get the project Discord info.
   */
  getProjectDiscord(){
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if (data.discord.link != undefined) {
        this.discordRef = data.discord;
        this.model.discordServerID = this.discordRef.link.split('/')[0];
        this.model.discordChannelID = this.discordRef.link.split('/')[1];
        this.discordIframeLink1 = this.sanitizer.bypassSecurityTrustResourceUrl("https://discordapp.com/widget?id="+ this.model.discordServerID);
        this.discordIframeLink2 = this.sanitizer.bypassSecurityTrustResourceUrl("https://disweb.dashflo.net/channels/"+ this.model.discordServerID + "/" + this.model.discordChannelID);
        this.discordService.getServerInfoFromId(this.model.discordServerID).subscribe(data2 => {
          console.log(data2['name'])
        },
        err => {
          console.log(err);
          this.errorStatus = err.status;
          if(err.status == '400'){
            this.errorMessage = "The Discord credentials are invalid";
          }
          else if(err.status == '403'){
            this.errorMessage = "The widget bot must be added to the server and widgets must be activated on the server";
          }
          else if(err.status == '404'){
            this.errorMessage = "The server/channel id is not an existing one";
          }
          else {
            this.errorMessage = err.statusText;
          }
        });

      }
    });

  }


  /**
   * Open the Discord Server add form popup.
   */
  openModal() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if(data.discord.link == undefined){
        this.modalService.open(this.popupServer, { centered: true });
      }
    });
  }

  /**
   * Open the Discord Server edit form popup.
   */
  openModalEdit() {
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      this.modalService.open(this.popupServer, { centered: true });
    });
  }


  onSubmit(form: NgForm) {
    this.projectService.updateProjectDiscord(this.projectId, form.value).subscribe(
      res => {
        this.getProjectDiscord();
      },
      err => {
        console.log(err);
      }
    );

  }

}
