import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { DbService } from '../../services/db/db.service';
import { RoutingService } from '../../services/routing/routing.service';
import jsPDF from 'jspdf';
import { apiUrls } from '../../constants/urlConstants';
import { ApiService } from '../../services/api/api.service';
import { BackNavigationHandlerComponent } from '../../shared/back-navigation-handler/back-navigation-handler.component';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'lib-certificate-page',
  templateUrl: './certificate-page.component.html',
  styleUrls: ['./certificate-page.component.css'],
})
export class CertificatePageComponent extends BackNavigationHandlerComponent {
  projectId: any;
  projectDetails: any;
  certificateUrl:any;

  @ViewChild('certificateContainer', { static: true }) certificateContainer:
    | ElementRef
    | undefined;

  constructor(
    private router: Router,
    private db: DbService,
    private routingService: RoutingService,
    private renderer: Renderer2,
    private apiService: ApiService,
    private http: HttpClient,
    private toasterService: ToastService
  ) {
    super(routingService);
    const url: UrlTree = this.router.parseUrl(this.router.url);
    this.projectId = url.queryParams['projectId'];
  }

  ngOnInit() {
    this.getProjectDetails();
  }

  getProjectDetails() {
    const configForProject = {
      url: `${apiUrls.GET_PROJECT_DETAILS}/${this.projectId}`,
      payload: {},
    };

    this.apiService.post(configForProject).subscribe((res) => {
      this.projectDetails = res.result;
      if (this.projectDetails.certificate) {
        if(this.projectDetails.certificate.eligible){
          const svgUrl = this.projectDetails.certificate.svgUrl;
          this.http.get(svgUrl, { responseType: 'text' }).subscribe((res) => {
            this.certificateUrl = res;
            if (this.certificateContainer) {
              this.renderer.setProperty(
                this.certificateContainer.nativeElement,
                'innerHTML',
                this.certificateUrl
              );

              const svgElement = this.certificateContainer.nativeElement.querySelector('svg');
              if (svgElement) {
                this.renderer.setStyle(svgElement, 'object-fit', 'contain');
                this.renderer.setStyle(svgElement, 'width', '100%');
              }
            }
          });
        }
      }
    });
  }

  download(type: string) {
    if (!this.certificateContainer) {
      return;
    }

    const svgElement =
      this.certificateContainer.nativeElement.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const viewBox = svgElement.getAttribute('viewBox');
      let width = img.width;
      let height = img.height;

      if (viewBox) {
        const viewBoxValues = viewBox.split(' ').map(Number);
        width = viewBoxValues[2];
        height = viewBoxValues[3];
      }
      const dpi = 300;
      const scale = dpi / 96;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx?.scale(scale, scale);
      ctx?.drawImage(img, 0, 0, width, height);
      if (type === 'pdf') {
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'pt',
          format: [width, height],
        });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${this.projectDetails.title}.pdf`);
        URL.revokeObjectURL(url);
      } else {
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${this.projectDetails.title}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
      this.toasterService.showToast("CERTIFICATE_DOWNLOAD_SUCCESS", "success");
    };
    img.src = url;
  }
}
