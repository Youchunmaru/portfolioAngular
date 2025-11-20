import { Routes } from '@angular/router';
import {Home} from './routes/home/home';
import {Project} from './routes/project/project';
import {NotFound} from './routes/not-found/not-found';
import {dataResolver} from './guards/data-resolver';

export const routes: Routes = [
  {
    path: '',
    title: 'Portfolio',
    component: Home,
    resolve: {
      data: dataResolver
    }
  },
  {
    path: 'projects/:id',
    title: 'Projects',
    component: Project,
    resolve: {
      data: dataResolver
    }
  },
  {
    path: '**',
    title: '404',
    component: NotFound,
  },
];
