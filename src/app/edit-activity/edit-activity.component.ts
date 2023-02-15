import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'src/types/activity';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.css'],
  providers: [DatePipe],
})
export class EditActivityComponent {
  startDate: Date | null;
  endDate: Date | null;

  constructor(
    public dialogRef: MatDialogRef<EditActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public activity: Activity,
    public datePipe: DatePipe
  ) {
    this.startDate = activity.startDate
      ? new Date(Date.parse(activity.startDate))
      : null;
    this.endDate = activity.endDate
      ? new Date(Date.parse(activity.endDate))
      : null;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.activity.startDate = this.startDate
      ? this.startDate.toISOString()
      : null;
    this.activity.endDate = this.endDate ? this.endDate.toISOString() : null;

    this.dialogRef.close(this.activity);
  }
}
