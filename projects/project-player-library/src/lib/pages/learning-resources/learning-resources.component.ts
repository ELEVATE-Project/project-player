import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db/db.service';
import { RoutingService } from '../../services/routing/routing.service';
import { Router, UrlTree } from '@angular/router';
import { BackNavigationHandlerComponent } from '../../shared/back-navigation-handler/back-navigation-handler.component';

@Component({
  selector: 'lib-learning-resources',
  templateUrl: './learning-resources.component.html',
  styleUrls: ['./learning-resources.component.css']
})
export class LearningResourcesComponent extends BackNavigationHandlerComponent implements OnInit {
  taskId: any;
  id: any;
  learningResources: any;

  constructor(private db: DbService, private routerService: RoutingService, private router: Router) {
    super(routerService)
  }

  ngOnInit(): void {
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    this.taskId = urlTree.queryParams['taskId']
    this.id = urlTree.queryParams['id']
    this.getProjectDetails();
  }

  getProjectDetails() {
    this.db.getData(this.id).then((data) => {
      let projectDetails = data.data;
      this.getTaskLearningResources(projectDetails);
    });
  }

  getTaskLearningResources(data: any) {
    let task = data.tasks.find((task: { _id: any; }) => task._id === this.taskId);
    this.learningResources = task.learningResources;
  }


  openResource(data: any) {
    window.open(data.link, '_blank');
  }
}
