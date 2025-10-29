import {Component, inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import {ExpansionPanel} from '../../components/expansion-panel/expansion-panel';
import {Card} from '../../components/card/card';
import {About, DataService, Skill, Project as P, Education, Experience} from '../../services/data.service';
import {map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {List} from '../../components/list/list';
@Component({
  selector: 'app-home',
  imports: [RouterLink, Card, AsyncPipe, MatButtonModule, MatTooltipModule, List],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  data = inject(DataService);
  about = <Observable<About>>this.data.getDataOf("about");
  primarySkills = <Observable<Skill[]>>this.data.getDataOf("primarySkills");
  secondarySkills = <Observable<Skill[]>>this.data.getDataOf("secondarySkills");
  projects = <Observable<P[]>>this.data.getDataOf("projects");
  education = <Observable<Education[]>>this.data.getDataOf("education");
  experience = <Observable<Experience[]>>this.data.getDataOf("experience");
  educationData = this.education.pipe(map(it => {
    return it.map(e => {
      return {
        title: e.name + " | " + e.degree,
        secondLine: "@ " + e.at + " | " + e.from + " - " + e.until,
        thirdLine: e.description,
      }
    })
  }))
  experienceData = this.experience.pipe(map(it => {
    return it.map(e => {
      return {
        title: e.name + " | " + e.position,
        secondLine: "@ " + e.at + " | " + e.from + " - " + e.until,
        thirdLine: e.description,
      }
    })
  }))
  hobbyData = this.about.pipe(map(it => {
    return it.hobbies
  }))
  date = new Date();

}
