import { Module } from '@nestjs/common';
import { NotifierGateway } from  './notifier.gateway';

@Module({
    exports: [NotifierModule],
    providers: [NotifierGateway],
})
export class NotifierModule {}
