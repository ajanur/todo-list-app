import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/models/todo.model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {

  todos: Todo[] = []
  priorities:number[] = [1, 2, 3, 4, 5,6];
  statusList:string[] = [];
  priority:any;
  isUpdate = false;
  submitted = false;
  taskExist = false;

  successMsg:any;
  deleteMsg:any;
  error:any;

  //subscription list
  statusListsub:any;
  todoListsub:any;
  todoAddSub:any;
  todoNameSub:any;
  todoUpdateSub:any;
  todoDeleteSub:any;



  todoForm: FormGroup = new FormGroup({
    "name": new FormControl('',[Validators.required,Validators.minLength(4)]),
    "priority": new FormControl('',[Validators.required,Validators.min(1),Validators.max(5)]),
    "status": new FormControl('',[Validators.required]),
  });

  todoFormUpdate!: FormGroup;

  constructor(private todoService:TodoService){}

  ngOnInit(){

    this.GetStatusList();
    this.GetTodoList();
    this.resetvalues()
  
  }

  resetvalues()
  {
    //this.isUpdate = false;
    this.submitted = false;
    this.taskExist = false;
    this.successMsg = null;
    this.error = null;
    this.deleteMsg = null;
  }

  //Properties are listed here
  get todoFormControl() {
    return this.todoForm.controls;
  }

  get sortedTodo(){
    //return this.todos.sort((a:Todo,b:Todo)=>a.priority-b.priority);
    //return this.todos.sort((a:Todo,b:Todo)=>b.name.localeCompare(a.name));
    return this.todos.sort((a:Todo,b:Todo) => b.status.localeCompare(a.status));
  }


  //methods are listed here
  GetStatusList(){
    this.statusListsub = this.todoService.GetStatusList()
    .subscribe({
      next: (data) => 
      {
        console.log(data);
        this.statusList = data;
      },
      error: (error) => 
      {
        throw error;
      },
      complete: () => console.info('complete') 
    });
  }

  GetTodoList(){
    this.todoListsub = this.todoService.GetTodoList()
    .subscribe({
      next: (data) => 
      {
        console.log(data);
        this.todos = data;
      },
      error: (error) => 
      {
        throw error;
        //this.error = error;
      },
      complete: () => console.info('complete') 
    });
  }

  //Actions are listed here
  onSubmit(){
    this.resetvalues();
    this.submitted = true;
    if (this.todoForm.invalid) {
      return;
    }
    //Server side validation and call Add Todo
    if(this.isUpdate){
      console.log("Update : " + this.isUpdate);
      this.onSave1();
    }
    else{
      let todo = new Todo(Guid.create(), this.todoForm.value.name, this.todoForm.value.priority, this.todoForm.value.status);
    this.todoAddSub = this.todoService.AddTodo(todo)
    .subscribe({
      next: (res) => 
      {
        console.log(res);
        this.successMsg = `Task ${todo.name} has been added successfully`;
        this.GetTodoList();
      },
      error: (err) => 
      {
        console.log("Submit : " + JSON.stringify(err));
        this.error = err.error;
      },
      complete: () => {console.info('complete')}
    });
    }

    // let todo = new Todo(Guid.create(), this.todoForm.value.name, this.todoForm.value.priority, this.todoForm.value.status);
    // this.todoAddSub = this.todoService.AddTodo(todo)
    // .subscribe({
    //   next: (res) => 
    //   {
    //     console.log(res);
    //     this.successMsg = `Task ${todo.name} has been added successfully`;
    //     this.GetTodoList();
    //   },
    //   error: (err) => 
    //   {
    //     console.log("Submit : " + JSON.stringify(err));
    //     this.error = err.error;
    //   },
    //   complete: () => console.info('complete') 
    // });

    // this.todoNameSub = this.todoService.Validation(this.todoForm.value.name).subscribe((res)=>
    // {
    //     console.log("fork Join" + JSON.stringify(res[0]));
    //     if(res[0] != null){
    //       this.error = `Task  ${res[0].name} is already exist in the list`;
    //       return;
    //     }
    //     let todo = new Todo(Guid.create(), this.todoForm.value.name, this.todoForm.value.priority, this.todoForm.value.status);
    //     this.todoAddSub = this.todoService.AddTodo(todo)
    //     .subscribe({
    //       next: (res) => 
    //       {
    //         console.log(res);
    //         this.successMsg = `Task ${todo.name} has been added successfully`;
    //         this.GetTodoList();
    //       },
    //       error: (err) => 
    //       {
    //         throw err;
    //         //this.error = err;
    //       },
    //       complete: () => console.info('complete') 
    //     });
    // })

  }
  
  onUpdate(id:Guid){
    this.resetvalues();
    this.isUpdate = true;
    console.log("update enabled");
    let todo = this.todos.filter(x=>x.id === id)[0];
    console.log(todo);

    //
    this.todoForm.patchValue({
      name : todo.name,
      priority : todo.priority,
      status : todo.status
    });


    // this.todoFormUpdate = new FormGroup({
    //   "updateName" : new FormControl(todo.name),
    //   "updatePriority": new FormControl(todo.priority),
    //   "updateStatus": new FormControl(todo.status),
    // });
  }

  onCancel(){
    this.resetvalues();
    this.isUpdate = false;
    this.todoForm.markAsUntouched;
  }

  onSave(){
    this.resetvalues();
    console.log("Saving new values");
    let value = this.todoFormUpdate.value;
    let todo = this.todos.filter(x=>x.name === value.updateName)[0];
    todo.name = value.updateName;
    todo.priority = value.updatePriority;
    todo.status = value.updateStatus;

    this.todoUpdateSub = this.todoService.UpdateTodo(todo)
    .subscribe({
      next: (res) => 
      {
        console.log(res);
        this.GetTodoList();
        this.successMsg = `Task  ${todo.name} has been updated successfully`;
        this.isUpdate = false;
      },
      error: (err) => 
      {
        console.log(err);
        this.error = err;
      },
      complete: () => console.info('complete') 
    });
  }

  onSave1(){
    this.resetvalues();
    console.log("Saving new values");
    let value = this.todoForm.value;
    let todo = this.todos.filter(x=>x.name === value.name)[0];
    todo.name = value.name;
    todo.priority = value.priority;
    todo.status = value.status;

    this.todoUpdateSub = this.todoService.UpdateTodo(todo)
    .subscribe({
      next: (res) => 
      {
        console.log(res);
        this.GetTodoList();
        this.successMsg = `Task  ${todo.name} has been updated successfully`;
        this.isUpdate = false;
      },
      error: (err) => 
      {
        console.log(err);
        this.error = err;
      },
      complete: () => console.info('complete') 
    });
  }

  onDelete(id: Guid){
    console.log("Deleting new values");
    this.resetvalues();

    let todo = this.todos.filter(x=>x.id === id)[0];
    if(todo != null || todo!=undefined){
      this.todoDeleteSub = this.todoService.DeleteTodo(id.toString())
      .subscribe({
        next: (res) => 
        {
          console.log(res);
          this.deleteMsg = `Task  ${todo.name} has been deleted successfully`;
          this.GetTodoList();
        },
        error: (err) => 
        {
          console.log(err.error);
          this.error = err.error;
        },
        complete: () => console.info('delete complete') 
      });
    }
    this.isUpdate = false;
  }

  //Unsubscribe all method here
  ngOnDestroy() {
    console.log("Unsubscribing all subscriptions");
    // if(this.statusListsub) this.statusListsub.Unsubscribe();
    // if(this.todoListsub) this.todoListsub.Unsubscribe();
    // if(this.todoAddSub) this.todoAddSub.Unsubscribe();
    // if(this.todoNameSub) this.todoNameSub.Unsubscribe();   
    // if(this.todoUpdateSub) this.todoUpdateSub.Unsubscribe();
    // if(this.todoDeleteSub) this.todoDeleteSub.Unsubscribe();
  }

}
