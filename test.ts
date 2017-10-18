import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  myForm: FormGroup
  constructor(private fb : FormBuilder){
  }
  
  ngOnInit (){
    this.createForm();
    this.dataSource = Observable
    .create((observer: any) => {
      // Runs on every search
      observer.next(this.myForm.controls.employeeAutocomplete.value);
    })
    .mergeMap((token: string) => this.getStatesAsObservable(token));
  }

  public getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig'); 
    console.log(token);
    return Observable.of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name);
      })
    );
  }

  createForm() {
    this.myForm = this.fb.group({
      employeeAutocomplete: [''],
      state1: [''],
      state2: ['']
    })
  }
  public states = ['CA', 'MD', 'OH', 'VA'];
  public states1 = Observable.of(['CA', 'MD', 'OH', 'VA']);
  public states2 = Observable.of([]);
  public asyncSelected: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public dataSource: Observable<any>;
  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }
 
  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }
 
public reloadForDependent(e) {
  let selected = e.target.value;
  this.states2 = Observable.of(this.states.filter(item => !(item === selected))).delay(2000);
}

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
    console.log('Selected value: ', e.item);
  }
  public statesComplex: any[] = [
    {id: 1, name: 'Alabama', region: 'South'}, {id: 2, name: 'Alaska', region: 'West'}, {
      id: 3,
      name: 'Arizona',
      region: 'West'
    },
    {id: 4, name: 'Arkansas', region: 'South'}, {id: 5, name: 'California', region: 'West'},
    {id: 6, name: 'Colorado', region: 'West'}, {id: 7, name: 'Connecticut', region: 'Northeast'},
    {id: 8, name: 'Delaware', region: 'South'}, {id: 9, name: 'Florida', region: 'South'},
    {id: 10, name: 'Georgia', region: 'South'}, {id: 11, name: 'Hawaii', region: 'West'},
    {id: 12, name: 'Idaho', region: 'West'}, {id: 13, name: 'Illinois', region: 'Midwest'},
    {id: 14, name: 'Indiana', region: 'Midwest'}, {id: 15, name: 'Iowa', region: 'Midwest'},
    {id: 16, name: 'Kansas', region: 'Midwest'}, {id: 17, name: 'Kentucky', region: 'South'},
    {id: 18, name: 'Louisiana', region: 'South'}, {id: 19, name: 'Maine', region: 'Northeast'},
    {id: 21, name: 'Maryland', region: 'South'}, {id: 22, name: 'Massachusetts', region: 'Northeast'},
    {id: 23, name: 'Michigan', region: 'Midwest'}, {id: 24, name: 'Minnesota', region: 'Midwest'},
    {id: 25, name: 'Mississippi', region: 'South'}, {id: 26, name: 'Missouri', region: 'Midwest'},
    {id: 27, name: 'Montana', region: 'West'}, {id: 28, name: 'Nebraska', region: 'Midwest'},
    {id: 29, name: 'Nevada', region: 'West'}, {id: 30, name: 'New Hampshire', region: 'Northeast'},
    {id: 31, name: 'New Jersey', region: 'Northeast'}, {id: 32, name: 'New Mexico', region: 'West'},
    {id: 33, name: 'New York', region: 'Northeast'}, {id: 34, name: 'North Dakota', region: 'Midwest'},
    {id: 35, name: 'North Carolina', region: 'South'}, {id: 36, name: 'Ohio', region: 'Midwest'},
    {id: 37, name: 'Oklahoma', region: 'South'}, {id: 38, name: 'Oregon', region: 'West'},
    {id: 39, name: 'Pennsylvania', region: 'Northeast'}, {id: 40, name: 'Rhode Island', region: 'Northeast'},
    {id: 41, name: 'South Carolina', region: 'South'}, {id: 42, name: 'South Dakota', region: 'Midwest'},
    {id: 43, name: 'Tennessee', region: 'South'}, {id: 44, name: 'Texas', region: 'South'},
    {id: 45, name: 'Utah', region: 'West'}, {id: 46, name: 'Vermont', region: 'Northeast'},
    {id: 47, name: 'Virginia', region: 'South'}, {id: 48, name: 'Washington', region: 'South'},
    {id: 49, name: 'West Virginia', region: 'South'}, {id: 50, name: 'Wisconsin', region: 'Midwest'},
    {id: 51, name: 'Wyoming', region: 'West'}];
}


<ng-template #customItemTemplate let-model="item" let-index="index">
  <span style="margin: 0 5px">{{model.name}}</span>
  <span style="margin: 0 5px">{{model.region}}</span>
  <span style="margin: 0 5px">{{model.id}}</span>
</ng-template>
<pre class="card card-block card-header">Model: {{myForm.value.state | json}}</pre>
<form [formGroup]="myForm">
  <input formControlName="employeeAutocomplete" (typeaheadLoading)="changeTypeaheadLoading($event)" (typeaheadNoResults)="changeTypeaheadNoResults($event)"
    (typeaheadOnSelect)="typeaheadOnSelect($event)" [typeahead]="dataSource" [typeaheadItemTemplate]="customItemTemplate" typeaheadOptionsLimit="7"
    typeaheadOptionField="name" typeaheadMinLength="4" placeholder="Typeahead inside a form" class="form-control">
  <div class="form-group">
    <label class="center-block">State 1:
      <select class="form-control" formControlName="state1" (change)="reloadForDependent($event)">
        <option *ngFor="let state of states1 | async" [value]="state">{{state}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">State 2:
      <select class="form-control" formControlName="state2">
        <option *ngFor="let state of states2  | async" [value]="state">{{state}}</option>
      </select>
    </label>
  </div>
</form>

TypeaheadModule.forRoot(),
