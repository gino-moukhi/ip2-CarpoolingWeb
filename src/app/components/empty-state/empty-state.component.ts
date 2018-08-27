import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent implements OnInit {
  @Input() message: string;

  constructor() {
    // this.message = 'It looks like you have no routes at the moment. Go join one or create one for others to use.';
  }

  ngOnInit() {
  }

}
