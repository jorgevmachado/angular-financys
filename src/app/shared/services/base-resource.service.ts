import {Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {BaseResourceModel} from '../models/base-resource.model';

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http:HttpClient;

  protected constructor(protected apiPath: string, protected injector:Injector) {
      this.http = injector.get(HttpClient);
  }

  getAll():Observable<T[]>{
    return this.http.get(this.apiPath)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToResources)
      )
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath,  resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    )
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(this.apiPath,  resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // PROTECTED METHODS
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(element as T));
    return  resources;
  }

  protected handleError(error: any): Observable<any> {
    console.error('ERRO NA REQUISIÇÂO => ', error);
    return throwError(error);
  }

  protected jsonDataToResource(jsonData: any): Category {
    return jsonData as T;
  }

}
