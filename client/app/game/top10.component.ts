import { Component, OnInit } from '@angular/core';
import { Top10Service } from '../services/top10.service';
import { User } from '../model/user';
 
@Component({
    moduleId:module.id,
    selector:'top',
    templateUrl:'top10.component.html'
})

export class Top10Component implements OnInit{
    
    playersStars: User[] = [];
    playersPoints: User[] = [];

    constructor(private top10Service: Top10Service){}

    ngOnInit(){
        this.getTopPlayersByStars();
        this.getTopPlayersByPoints();
    }

    getTopPlayersByStars() : void{
        this.top10Service.getTop10byStars().subscribe(players => this.playersStars = players);
    }

    getTopPlayersByPoints() : void{
        this.top10Service.getTop10byPoints().subscribe(players => this.playersPoints = players);
        console.log(this.playersPoints);
    }
}
