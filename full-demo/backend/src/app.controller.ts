import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';
import { jwtConstants } from "./constants";


@Controller()
export class AppController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('/getHello')
  getHello() {
    return "Hello World!";
  }

  @Post('/encrypt-and-store')
  encryptAndStoreJWT(@Body() body: {data: Object, exp: string}, @Res() res: Response): any { 
    console.log(body);
    const token = this.jwtService.sign(body.data, {secret: jwtConstants.secret, expiresIn: body.exp }  );
    // res.cookie('qrpcookie', token).send({status: 'ok'});
    res.cookie('qrpcookie', token, {expires: new Date(Date.now() + 3600000), httpOnly: false, secure: true, sameSite: 'none'}).send({status: 'ok'});
  }

  @Post('/deleteCookie')
  deleteCookie(@Res() res: Response): any { 
    res.cookie('qrpcookie', "", {expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"), httpOnly: false, secure: true, sameSite: 'none'}).send({status: 'ok'});
  }

  @Post('/encrypt')
  encryptJWT(@Body() body: {data: Object, exp: string}): {token: string} { 
    const token = this.jwtService.sign(body.data, {secret: jwtConstants.secret, expiresIn: body.exp }  );
    return { token }
  }

  @Post('/decrypt')
  decryptJWT(@Body() body: {encrypted_token: string} ): { token: string | Object} {
    console.log("enctoken", body.encrypted_token)
    const token = this.jwtService.decode(body.encrypted_token, {complete: true});
    console.log("token:", token)
    
    return { token };
  }

  

  @Post('/verify')
  verifyJWT(@Body() body: {encrypted_token: string} ): { validity: boolean} {
    try {
      const token = this.jwtService.verify(body.encrypted_token, {complete: true});
      const validity = true;
      return { validity };
    } catch(err) {
      const validity = false;
      return { validity };
    }
  }

  @Post('/check-for-cookies')
  verifyCookieJWT(@Req() req: Request): { validity: boolean, cookie: string | null} {
    // console.log(req.cookies);
    // console.log(req.cookies.qrpcookie);
    try {
      const token = this.jwtService.verify(req.cookies.qrpcookie, {secret: jwtConstants.secret});
      // res.send({"validity": true, "cookie": req.cookies.qrpcookie});
      return {"validity": true, "cookie": req.cookies.qrpcookie};
    } catch(err) {
      console.log(err);
      console.log("Either the cookie is invalid or there was no cookie to begin with. Pick your poison.");
      // res.send({"validity": false, "cookie": null})
      return {"validity": false, "cookie": null}
    }
  }
}
