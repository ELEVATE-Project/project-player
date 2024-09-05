import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnChanges {
@Input()projectDetails: any = {};
panelOpenStateForCertificate = false;
panelOpenStateForResources = false;
validationTexts!: string[];
learningResources: any[] = [];
ngOnChanges(changes: SimpleChanges): void {
  if (changes['projectDetails']) {
    this.learningResources = this.projectDetails?.learningResources || [];
    this.getCertificateCriteria();
  }
}
getCategoryLabels(): string {
  return this.projectDetails.categories.map((item: { name: any; }) => item.name).join(', ');
}
getRecommendedFor(): string {
  return this.projectDetails.recommendedFor.map((item: any) => item).join(', ');
}

getCertificateCriteria(): string[] {
  this.validationTexts = []; // Initialize validationTexts as an empty array

  const conditions = this.projectDetails?.certificate ? this.projectDetails?.certificate?.criteria?.conditions : this.projectDetails?.criteria?.conditions
  if (conditions) {
    for (const conditionKey in conditions) {
      if (Object.prototype.hasOwnProperty.call(conditions, conditionKey)) {
        const condition = conditions[conditionKey];
        if (condition.validationText) {
          this.validationTexts.push(condition.validationText);
        }
      }
    }
  }
  return this.validationTexts;
}

openResource(data:any){
  window.open(data.link, '_blank');
}

}
