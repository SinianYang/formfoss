import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormModel} from '../../../../models/form/form.model';
import {QuestionService} from '../../../../services/question.service';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../util/form.util';
import {AlertService} from '../../../../services/alert.service';

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.component.html',
    styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
    formObject: FormModel;
    formGroup: FormGroup;

    constructor(private activatedRoute: ActivatedRoute,
                private location: Location,
                private qtService: QuestionService,
                private alertService: AlertService) { }

    ngOnInit() {
        const isPublished = this.activatedRoute.snapshot.queryParams['isPublished'] || false;
        const formId = +this.activatedRoute.snapshot.params['id'];

        if (isPublished) {
            this.qtService.getPublishedById(formId)
                .subscribe(res => {
                    this.formObject = res;
                    this.formGroup = FormUtil.toFormViewGroup(this.formObject.formItems);
                }, error => this.alertService.error(error));
        } else {
            this.qtService.getForm(formId)
                .subscribe(res => {
                    this.formObject = res;
                    this.formGroup = FormUtil.toFormViewGroup(this.formObject.formItems);
                }, this.alertService.error)
        }

        /*
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                return this.qtService.getForm(+params.get('id'))
            })
            .subscribe((form: FormModel) => {
                this.formObject = form;
                this.formGroup = FormUtil.toFormViewGroup(this.formObject.formItems);
            });
            */
    }

    goBack() {
        this.location.back();
    }

}
