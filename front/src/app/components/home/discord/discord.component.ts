import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from 'src/app/services/projet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-discord',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.scss']
})
export class DiscordComponent implements OnInit {
  @ViewChild('popupServer', {static: false}) popupServer;

  public projectId;
  public discordRef;
  public discordIframeLink;

  constructor(private route: ActivatedRoute,
    public projectService: ProjetService,
    public modalService: NgbModal,
    public sanitizer : DomSanitizer) { }

    model = {
      discordServerID: ''
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

  /**
   * Get the project Discord info.
   */
  getProjectDiscord(){
    this.projectService.getProjectById(this.projectId).subscribe(data => {
      if (data.discord.link != undefined) {
        this.discordRef = data.discord;
        this.model.discordServerID = this.discordRef.link;
        this.discordIframeLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://discordapp.com/widget?id="+ this.model.discordServerID);
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


  onSubmit(form: NgForm) {
    this.projectService.updateProjectDiscord(this.projectId, form.value).subscribe(
      res => {

      },
      err => {
        console.log(err);
      }
    );

  }

}
