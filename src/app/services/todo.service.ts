import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, throwError } from 'rxjs';
import { Todo } from 'src/models/todo.model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  //Without Cors enable in server using proxy config
  //BaseUrl : string = "http://localhost:4200";

  //With Cors enable in server
  BaseUrl : string = "https://localhost:5001";

  constructor(private http:HttpClient) { }
  
  GetStatusList():Observable<string[]>{
    return this.http.get<string[]>(this.BaseUrl + '/api/todo/status')
    .pipe(catchError(this.handleError));
  }

  GetTodoList():Observable<Todo[]>{
    return this.http.get<Todo[]>(this.BaseUrl + '/api/todo').pipe(catchError(this.handleError));
  }

  GetTodo(id:Guid):Observable<Todo>{
    return this.http.get<Todo>(this.BaseUrl + '/api/todo' + id).pipe(catchError(this.handleError));
  }

  AddTodo(todo: Todo):Observable<Todo>{
    const headers = {'content-type': 'application/json' };
    const body = { 
      "Id": todo.id.toString(),
      "Name" : todo.name,
      "Priority":todo.priority,
      "Status" : todo.status
      };
      //console.log(JSON.stringify(body));
      return this.http.post<Todo>(this.BaseUrl + '/api/todo',JSON.stringify(body),{headers : headers})
      .pipe(catchError(this.handleError));
  }

  UpdateTodo(todo: Todo):Observable<any>{
    const headers = {'content-type': 'application/json' };
    const body = { 
      "Id": todo.id.toString(),
      "Name" : todo.name,
      "Priority":todo.priority,
      "Status" : todo.status
     };
    //console.log(" Update Service...");
    return this.http.put<Todo>(this.BaseUrl + '/api/todo',JSON.stringify(body), {headers : headers})
      .pipe(catchError(this.handleError));
  }

  DeleteTodo(id: string):Observable<any>{
    //console.log(" Delete Service...");
    return this.http.delete<any>(this.BaseUrl + '/api/todo/' + id)
      .pipe(catchError(this.handleError));
  }

  //Validation Logic
  GetTodoByName(name: string):Observable<Todo>{
    return this.http.get<Todo>(this.BaseUrl + '/api/todo/task/' + name)
    .pipe(catchError(this.handleError));
  }

  //Validation logic API call
  public Validation(name:string): Observable<any[]>
  {
    let call1=this.http.get<Todo>(this.BaseUrl + '/api/todo/task/' + name).pipe(catchError(this.handleError));
    //let call2=this.http.get(this.BaseUrl+'/api/todo/task/')
    //let call3=this.http.get(this.BaseUrl+'/api/todo/task/')
    //return forkJoin([call1, call2,call3]);
    return forkJoin([call1]);
  }

  //Error handling
  handleError(error: HttpErrorResponse) {
    let errorMessage = {
      code : 500,
      error : "Unknown error!",
    };
    if (error.error instanceof ErrorEvent) {
      // log Client-side errors
      errorMessage.error = `Error: ${error.error.message}`;
    } else {
      // log Server-side errors
      console.log(error);
      errorMessage.code = error.status;
      //errorMessage.error = `Error Code: ${error.status}\nMessage: ${error.message}`;
      errorMessage.error = error.error.errors != null ? JSON.stringify(error.error.errors) : error.error;
    }
    //window.alert(errorMessage);
    return throwError(()=>errorMessage);
  }

}
