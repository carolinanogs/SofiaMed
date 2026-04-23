import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [BottomNavComponent, ToastComponent],
  imports: [CommonModule, RouterModule],
  exports: [BottomNavComponent, ToastComponent],
})
export class SharedModule {}
