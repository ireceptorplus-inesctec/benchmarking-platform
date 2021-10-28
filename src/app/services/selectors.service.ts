import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class SelectorsService {

    constructor(private http: HttpClient) {
    }

    getSelectors(): Observable<any[]> {
        return this.http.get<any[]>('/api/selectors');
    }

    addSelector(selector: any): Observable<any> {
        return this.http.post<any>('/api/selector', selector);
    }

    addSelectorGenes(selector: any): Observable<any> {
        return this.http.post<any>( `/api/selectorGenes/${selector._id}`, selector);
    }

    getSelector(selector: any): Observable<any> {
        return this.http.get<any>(`/api/selector/${selector._id}`);
    }

    editSelector(selector: any): Observable<any> {
        return this.http.put(`/api/selector/${selector._id}`, selector, {responseType: 'text'});
    }

    deleteSelector(selector: any): Observable<any> {
        return this.http.delete(`/api/selector/${selector._id}`, {responseType: 'text'});
    }
}
