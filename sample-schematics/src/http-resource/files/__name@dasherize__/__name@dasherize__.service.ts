import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {<%= classify(name) %>} from './<%= dasherize(name) %>'

const API_URL = '<%= url %>';

@Injectable({
    providedIn: 'root'
})
export class <%= classify(name) %>Service{

    constructor(private http: HttpClient){

    }

    findAll(): Observable <<%=classify(name) %> [] > {
        return this.http.get <<%=classify(name)%> [] > (API_URL);
    }

    <% if(findOne){ %>
    findOne(id:number):Observable<<%=classify(name)%>>{
        return this.http.get<<%=classify(name)%>>(`${API_URL}/${id}`)
    }
    <% } %>
}