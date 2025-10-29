import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {DataService, PortfolioData} from '../services/data.service';

export const dataResolver: ResolveFn<boolean> = (route, state) => {

  const data = inject(DataService);

  return true;
};
