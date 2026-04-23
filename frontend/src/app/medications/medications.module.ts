import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MedicationsRoutingModule } from './medications-routing.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './pages/home/home.component';
import { MedicationListComponent } from './pages/medication-list/medication-list.component';
import { HistoryComponent } from './pages/history/history.component';
import { MedicationCardComponent } from './components/medication-card/medication-card.component';
import { MedicationFormComponent } from './components/medication-form/medication-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    MedicationListComponent,
    HistoryComponent,
    MedicationCardComponent,
    MedicationFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MedicationsRoutingModule,
    SharedModule,
  ]
})
export class MedicationsModule {}
