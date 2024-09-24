import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoutingService } from '../../services/routing/routing.service';
import { statusLabels, statusType } from '../../constants/statusConstants';

@Component({
  selector: 'lib-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task: any;
  @Input() submittedImprovement: any;
  @Input() actionsList:any;
  @Output() newItemEvent = new EventEmitter<any>();
  @Input() startImprovement?:any;
  @Input() projectId?:any;
  @Output() startImprovementEvent = new EventEmitter<any>();


  statusLabels:any = statusLabels
  statusTypes:any = statusType


  constructor(private routerService: RoutingService) {}

  actionsEmit(item:any){
    const data = { action: item.action, ...this.task };
    this.newItemEvent.emit(data);
  }

  moveToDetailsTask(data: any) {
    if (!this.submittedImprovement && !this.startImprovement) {
      this.routerService.navigate(`/project-details`,{type:'taskDetails', taskId: data, projectId: this.projectId});
    }
    else if(!this.submittedImprovement && this.startImprovement){
      this.startImprovementEvent.emit(data);
    }
  }

}
