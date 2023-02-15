import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Activity } from 'src/types/activity';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public Todo: Activity[] = [];
  public InProgress: Activity[] = [];
  public Done: Activity[] = [];
  public activities: Activity[] = [];
  title = 'viaxlab-challenge';
  constructor(private dialog: MatDialog, private http: HttpClient) {}

  openAddActivityDialog(): void {
    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '350px',
      data: {
        title: '',
        startDate: null,
        endDate: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.activities.push({
          activityId: this.activities.length + 1,
          title: result.title,
          type: result.type,
          startDate: result.startDate,
          endDate: result.endDate,
          status: '',
        });

        this.filterActivities();
      }
    });
  }
  openEditActivityDialog(activity: Activity): void {
    const dialogRef = this.dialog.open(EditActivityComponent, {
      width: '350px',
      data: activity,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.activities.findIndex(
          (a) => a.activityId === activity.activityId
        );
        this.filterActivities();
      }
    });
  }

  handleDelete(activity: Activity): void {
    const index = this.activities.findIndex(
      (a) => a.activityId === activity.activityId
    );
    if (index !== -1) {
      this.activities.splice(index, 1);
      this.filterActivities();
    }
  }

  drop(event: CdkDragDrop<Activity[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.modifyDraggedActivities();
    }
  }

  //Modificar datos de la actividad luego de un drag and drop, solo si se cambia de columna
  modifyDraggedActivities(): void {
    this.Todo.forEach((element) => {
      element.endDate = null;
      element.startDate = null;
      element.status = null;
    });
    this.InProgress.forEach((element) => {
      element.endDate = null;
      element.startDate = new Date().toISOString();
      element.status = 'IN_PROGRESS';
    });
    this.Done.forEach((element) => {
      element.endDate = new Date().toISOString();
      element.status = 'DONE';
      element.endDate = element.endDate
        ? element.endDate
        : new Date().toISOString();
    });
  }

  filterActivities(): void {
    this.Todo = this.activities.filter((a) => !a.startDate && !a.endDate);
    this.InProgress = this.activities.filter((a) => a.startDate && !a.endDate);
    this.Done = this.activities.filter((a) => a.endDate);
  }

  ngOnInit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http
      .get<any[]>('http://localhost:3001/api/activities', { headers })
      .subscribe((data) => {
        this.activities = data;
        this.filterActivities();
      });
  }
}
