import {Component, inject, signal, WritableSignal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DataService, Project as P} from '../../services/data.service';
import {CommonModule} from '@angular/common';
import {map, Observable} from 'rxjs';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-project',
  imports: [CommonModule, MatButton],
  templateUrl: './project.html',
  styleUrl: './project.css',
  providers: [DataService]
})
export class Project {
  projectId = signal('');
  projectData!: Observable<P>;
  private activatedRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private router = inject(Router);
  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.projectId.set(params['id']);
      const projects = this.dataService.getDataOf("projects") as Observable<P[]>;
      const project = projects.pipe(map(it => {
        const project = it.find(p => p.title.toString() == this.projectId());
        if (!project) {
          this.router.navigate(['/not-found']);
        }
        return project;
      }))
      this.projectData = project as Observable<P>;
    });
  }
}
