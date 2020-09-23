import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class JobsService {

    constructor(private http: HttpClient) {
    }

    getJobs(): Observable<any[]> {
        return this.http.get<any[]>('/api/jobs');
    }

    addJob(job: any): Observable<any> {
        return this.http.post<any>('/api/job', job);
    }

    getJob(job: any): Observable<any> {
        return this.http.get<any>(`/api/job/${job._id}`);
    }

    editJob(job: any): Observable<any> {
        return this.http.put(`/api/job/${job._id}`, job, {responseType: 'text'});
    }

    deleteJob(jobID: any): Observable<any> {
        return this.http.delete(`/api/job/${jobID}`, {responseType: 'text'});
    }

}
