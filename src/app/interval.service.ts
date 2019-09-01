import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, expand, switchMap, takeUntil, tap } from 'rxjs/operators';

export interface IntervalMapItem {
	apiCall: Observable<any>;
	pause: Subject<string>;
	interval: Observable<any>;
	source: BehaviorSubject<string>;
}

@Injectable({
	providedIn: 'root'
})
export class IntervalService implements OnDestroy {
	intervalMap = new Map<string, IntervalMapItem>();
	private SECONDS = 30;
	private destroy$ = new Subject();

	constructor() {}

	startInterval(keys: string | string[]) {
		if (!Array.isArray(keys)) {
			keys = [keys];
		}
		keys.forEach((key, index) => {
			setTimeout(() => {
				if (!this.intervalMap.has(key)) {
					this.addScheduledInterval(key);
				}
				this.intervalMap.get(key).interval = this.createSchedule(key);
				this.intervalMap
					.get(key)
					.interval.pipe(takeUntil(this.destroy$))
					.subscribe(() => {});
			}, index * 1500);
		});
	}

	addScheduledInterval(key: string) {
		const intervalMapItem = {
			apiCall: of(key).pipe(
				delay(1000),
				tap(val => console.log(val))
			),
			pause: new Subject<string>(),
			interval: new Observable<any>(),
			source: new BehaviorSubject('')
		};
		this.intervalMap.set(key, intervalMapItem);
	}

	getData(key: string) {
		const intervalMapItem = this.intervalMap.get(key);
		intervalMapItem.pause.next();
		intervalMapItem.apiCall
			.pipe(
				tap(val => console.log('from manual call')),
				tap(() => intervalMapItem.source.next(''))
			)
			.subscribe(() => console.log('get data'));
	}

	cancelInterval(key: string) {
		if (!!key) {
			this.intervalMap.get(key).pause.next(Date.now().toString());
		}
	}

	cancelAll() {
		this.destroy$.next();
	}

	private createSchedule(key: string = ''): Observable<number> {
		console.log(`schedule created ${key}`);
		this.intervalMap.get(key).source.next('');
		return this.intervalMap.get(key).source.pipe(
			expand(val =>
				of(val).pipe(
					delay(this.SECONDS * 1000),
					switchMap(() => {
						console.log(`wait for it...${key}`);
						return key ? this.intervalMap.get(key).apiCall : of(null);
					}),
					takeUntil(this.intervalMap.get(key).pause)
				)
			)
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		console.log('destroy!');
	}
}
