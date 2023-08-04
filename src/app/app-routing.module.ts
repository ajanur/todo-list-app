import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './src/todo-list/todo-list.component';
import { PageNotFoundComponent } from './src/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '',   redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: TodoListComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
