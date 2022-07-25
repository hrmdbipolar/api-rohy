import { Injectable } from '@nestjs/common';
import { DatabaseFileService } from 'src/files/file.service';
import { StudentEntity } from 'src/student/student.entity';
import { StudentMapper } from 'src/student/student.mapper';
import { FindOptions, StudentRepository } from 'src/student/student.repository';
import { CreateUserDto } from 'src/user/user.dto';
import { UserMapper } from 'src/user/user.mapper';
import { UserService } from 'src/user/user.service';
import { CreateParentDto } from './parent.dto';
import { Parent, ParentStatus } from './parent.model';
import { ParentRepository } from './parent.repository';

@Injectable()
export class ParentService {
    constructor(
        private readonly parentRepository: ParentRepository,
        private readonly studentRepository: StudentRepository,
        private readonly userService: UserService,
        private readonly databaseFileService: DatabaseFileService
    ) { }

    async toEntities(studentIds: string[], students: StudentEntity[]) {
        studentIds.forEach(async element => {
            const options: FindOptions = { id: element }
            try {
                const student = await this.studentRepository.findBy(options);
                console.log(student);
                const entity = StudentMapper.toEntity(student);
                students.push(entity);
            } catch (e) {
                console.log(e);
            }
        });
    }

    async createParent(dto: CreateParentDto) {
        const parent = new Parent();
        parent.lastname = dto.lastname;
        parent.firstname = dto.firstname;
        parent.status = ParentStatus.ACTIVE;
        const idNumber = await this.userService.generateIdNumber();
        parent.idNumber = idNumber;
        const createUserDto: CreateUserDto = {
            idNumber: idNumber,
            email: dto.email,
            password: dto.password
        }
        const user = UserMapper.toEntity(await this.userService.createUser(createUserDto))
        parent.userId = user.id;
        const studentIds = dto.studentIds;
        let students: StudentEntity[] = [];
        await this.toEntities(studentIds, students);
        parent.students = students;
        return this.parentRepository.save(parent);
    }

    async addAvatar(imageBuffer: Buffer, filename: string, id: string) {
        const avatar = await this.databaseFileService.uploadDatabaseFile(imageBuffer, filename);
        const options = {
            firstname: "",
            lastname: "",
            avatarId: avatar.id,
            students: []
        }
        await this.parentRepository.update(options, id);
    }

    async deleteParent(id: string) {
        this.parentRepository.delete(id);
    }
}
