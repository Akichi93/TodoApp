import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from '../../common/constants';
import { UserPayload } from '../../common/decorators/user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.body?.refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        JWT_CONSTANTS.REFRESH_TOKEN_SECRET,
        'refresh-secret',
      ),
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.refreshToken === null) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: user.id, email: user.email };
  }
}

