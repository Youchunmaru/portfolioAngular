import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, shareReplay} from 'rxjs';

export interface PortfolioData {
  "projects": Project[];
  "primarySkills": Skill[];
  "secondarySkills": Skill[];
  "about": About;
  "education": Education[];
  "experience": Experience[];
}

export interface Project {
  title: string
  subtitle: string
  img: string
  content: string
  tldr: string
  links: {
    name: string
    link: string
  }[]
}
export interface Skill {
  name: string,
  level: string,
}

export interface About {
  firstName: string,
  lastName: string,
  job: string,
  introduction: string,
  contact: Contact
  socials: Social[]
  languages: string[]
  hobbies: Hobby[]
}

export interface Contact {
  email: string,
  phone?: string,
  address?: string,
}

export interface Social {
  name: string,
  link: string,
}

export interface Hobby {
  name: string,
  description: string,
}
export interface Education {
  name: string,
  degree: string,
  from: string,
  until: string,
  description: string,
  at: string,
}

export interface Experience {
  name: string,
  position: string,
  from: string,
  until: string,
  description: string,
  at: string,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  http = inject(HttpClient);
  private data?: Observable<PortfolioData>;
  getData(){
    if (!this.data) {
      this.data = this.http.get<PortfolioData>('data.json')
        .pipe(shareReplay({bufferSize: 1, refCount: false}));
    }
    return this.data;
  }

  getDataOf(name: keyof PortfolioData){
    return this.getData().pipe(map(data => data[name]));
  }

  getDataOfAbout(name: keyof About){
    const r = this.getDataOf("about") as Observable<About>;
    return r.pipe(map(about => about[name]));
  }
}
