import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MedicationListComponent } from './pages/medication-list/medication-list.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  { path: 'hoje',      component: HomeComponent },
  { path: 'remedios',  component: MedicationListComponent },
  { path: 'historico', component: HistoryComponent },
  { path: '',          redirectTo: 'hoje', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicationsRoutingModule {}
