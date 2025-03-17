import { Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    ) {}

    async signUp(signupDto: SignUpDto) {
        const { name, email, password } = signupDto;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        });

        await user.save();
        const token = this.jwtService.sign(
            { id: user.id },
            {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRES'),
            },
        );
        return { token };
    }
        
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({
        email,
        });

        if (!user) throw new UnauthorizedException('invalid email or password');
        const passwordMatch = await bcrypt.compare(password,
        user.password);
        if (!passwordMatch)
        throw new UnauthorizedException('invalid email or password');
        const token = this.jwtService.sign(
            { id: user.id },
            {
            secret: this.configService.get('JWT_SECRET'),
            },
        );
        return { token };
    }
}