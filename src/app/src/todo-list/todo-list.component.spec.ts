import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoListComponent } from './todo-list.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  // let todoServiceMock = {
  //   statusListsub: jasmine.createSpyObj('[GetStatusList]'),
  // };
   let todoServiceMock;
  // todoServiceMock.GetStatusList.and.returnValue('king');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [ ReactiveFormsModule,FormsModule,HttpClientTestingModule ],
      // providers: [{
      //   provide: TodoService,
      //   useValue: jasmine.createSpyObj('TodoService', ['GetStatusList'],['GetTodoList'])
      // }]
    });
    // todoServiceMock = TestBed.get(TodoService);
    // todoServiceMock.GetStatusList.and.returnValue(of([]));
    // todoServiceMock.GetTodoList.and.returnValue(of([]));
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })
 
  it('should create the todo', () => {
     // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    expect(component).toBeTruthy();
  });

});
