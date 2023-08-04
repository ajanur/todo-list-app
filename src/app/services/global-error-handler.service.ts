import { ErrorHandler, Injectable} from '@angular/core';
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
 
    constructor() { 
    }
  
    handleError(error: { message: any; }) {
       console.error('An error occurred:', error.message);
       console.error(error);
       alert("There is an internal error occured. Please contact to support centre"); 
   }
}