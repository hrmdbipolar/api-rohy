import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './shared/config/config.service';
import { StudentModule } from './student/student.module';
import { SubjectModule } from './subject/subject.module';
import { NoteModule } from './note/note.module';
import { GradeModule } from './grade/grade.module';
import { TimetableModule } from './timetable/timetable.module';
import { ParentModule } from './parent/parent.module';
import { DatabaseFileModule } from './files/file.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    StudentModule,
    SharedModule,
    ParentModule,
    SmsModule,
    DatabaseFileModule,
    TypeOrmModule.forRoot(configService.getTypeORMConfig()),
    SubjectModule,
    NoteModule,
    GradeModule,
    TimetableModule,
  ],
})
export class AppModule { }
