import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { jwtConstants } from "../constants";


@Controller()
export class AppController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('encrypt')
  encryptUser(@Body() body: { encryptJSON: string }): { token: string } {

    console.log("lmaoen:" + body.encryptJSON);
    // console.log(jwtConstants.secret); 
    const token = this.jwtService.sign({ userId: body.encryptJSON }, {secret: jwtConstants.secret}  );
    return { token };
  }

  @Post('decrypt')
  decryptUser(@Body() body: {encrypted_token: string} ): { token: string | Object} {
    // console.log("lmao:" + body[0]);

    console.log(body.encrypted_token);
    const token = this.jwtService.decode(body.encrypted_token, {complete: true});
    console.log("app.controller token decrypt")
    console.log(token);
    return { token };
  }
}