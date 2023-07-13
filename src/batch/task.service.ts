import {Injectable, Logger} from "@nestjs/common";
import {Cron, Interval, SchedulerRegistry, Timeout} from "@nestjs/schedule";
import {CronJob} from "cron";

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(private schedulerRegistry: SchedulerRegistry) {
        this.addCronJob();
    }

    addCronJob() {
        const name = 'cronSample';
        const job = new CronJob('* * * * * *', () => {
            this.logger.warn(`run! ${name}`);
        });
        this.schedulerRegistry.addCronJob(name, job);
        this.logger.warn(`job ${name} added!`);
    }
}
//     @Interval('intervalTask',30000)
//     handleInterval(){
//         this.logger.log('Task called by interval')
//     }
//     @Cron(new Date(Date.now() + 3*1000),{name:'cronTask'})
//     handleCron(){
//         this.logger.log('Task Called');
//     }
//
//     @Timeout('timeoutTask',5000)
//     handleTimeout(){
//         this.logger.log('Task called by timeout')
//     }
//
// }